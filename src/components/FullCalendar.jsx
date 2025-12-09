import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import "../styles/calendar.css";
import { useState, useRef, useCallback } from "react";
import shiftsService from "../services/shifts";
import { promptCreateShift } from "../utils/NotificationWindows/ShiftFormPrompt";
import Toast from "../utils/NotificationWindows/Toast";
import AlertError from "../utils/NotificationWindows/AlertError";
import showShiftDetails from "../utils/NotificationWindows/ShiftDetailsSidebar";

const Calendar = ({ clientList = [], setIsDraggingEvent }) => {
    const [currentView, setCurrentView] = useState("timeGridWeek");
    const calendarRef = useRef(null);
    const draggedEventRef = useRef(null);

    // Filtrar clientes activos del prop recibido
    const clientes = clientList.filter((client) => !client.esta_eliminado);

    // Función para cargar turnos del backend
    const loadShifts = useCallback(async (fetchInfo) => {
        try {
            // Calcular rango: 1 mes antes de hoy hasta 11 meses después (1 año total)
            const today = new Date();
            const oneMonthAgo = new Date(today);
            oneMonthAgo.setMonth(today.getMonth() - 1);

            const elevenMonthsLater = new Date(today);
            elevenMonthsLater.setMonth(today.getMonth() + 11);

            // Formatear fechas a YYYY-MM-DD
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
            };

            const fecha_inicio = formatDate(oneMonthAgo);
            const fecha_fin = formatDate(elevenMonthsLater);

            const response = await shiftsService.listarTurnos(
                fecha_inicio,
                fecha_fin
            );

            // Convertir turnos del backend al formato de FullCalendar
            const formattedEvents = response.listado_turnos.map((turno) => ({
                id: turno.id,
                title: turno.cliente.nombre_completo,
                start: turno.fecha_hora_inicio_turno,
                end: turno.fecha_hora_fin_turno,
                extendedProps: {
                    turnoId: turno.id,
                    nro_turno: turno.nro_turno,
                    observaciones: turno.observaciones,
                    es_sobreturno: turno.es_sobreturno,
                    telefono: turno.cliente.telefono,
                    tomadoPor: turno.tomadoPor.nombre_completo,
                },
                editable: true,
            }));

            return formattedEvents;
        } catch (error) {
            console.error("Error cargando turnos:", error);
            AlertError(
                `Error al cargar turnos: ${
                    error.response?.data?.message || error.message
                }`
            );
            return [];
        }
    }, []);

    // Nombres de meses y días capitalizados
    const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "🎄Diciembre🎄",
    ];

    const shortMonthNames = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
    ];

    const dayNames = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];

    // Locale español personalizado
    const customEsLocale = {
        ...esLocale,
        buttonText: {
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
        },
    };

    // Manejar cuando se suelta un cliente (drag & drop)
    const handleEventReceive = async (info) => {
        const clienteTitle = info.event.title;
        const clienteId = info.event.id;
        const startDate = info.event.start;
        const endDate = info.event.end;
        const now = new Date();

        // Validar que la fecha de inicio no sea anterior a la hora actual
        if (startDate < now) {
            Toast(
                "error",
                "No se pueden crear turnos en fechas u horas pasadas"
            );
            info.revert();
            return;
        }

        // Buscar el cliente por ID (más confiable que por título)
        let cliente = clientes.find((c) => c.id === clienteId);

        // Si no se encuentra por ID, intentar buscar por título como fallback
        if (!cliente) {
            cliente = clientes.find((c) => c.title === clienteTitle);
        }

        if (!cliente) {
            AlertError(
                "No se pudo identificar el cliente. Por favor, recargue la página."
            );
            info.revert();
            return;
        }

        // Mostrar formulario para confirmar/editar el turno
        const turnoData = await promptCreateShift(
            clientes,
            startDate,
            endDate,
            cliente.id
        );

        if (turnoData) {
            try {
                await shiftsService.registrarTurno(
                    turnoData.fecha_hora_inicio,
                    turnoData.fecha_hora_fin,
                    turnoData.observaciones || "",
                    turnoData.cliente_id,
                    false
                );

                Toast("success", "Turno creado exitosamente");

                // Eliminar el evento temporal del drag & drop
                info.event.remove();

                // Recargar turnos desde el backend
                if (calendarRef.current) {
                    const calendarApi = calendarRef.current.getApi();
                    calendarApi.refetchEvents();
                }
            } catch (error) {
                console.error("Error al crear turno:", error);
                console.error("Response data:", error.response?.data);
                console.error("Request data:", error.config?.data);
                AlertError(
                    `Error al crear turno: ${
                        error.response?.data?.message || error.message
                    }`
                );
                // Revertir el evento si falla
                info.revert();
            }
        } else {
            // Usuario canceló, revertir el evento
            info.revert();
        }
    };

    // Manejar selección de rango de fechas (crear turno sin arrastrar)
    const handleSelect = async (selectInfo) => {
        const startDate = selectInfo.start;
        const endDate = selectInfo.end;
        const now = new Date();

        // Verificar que la fecha de inicio no sea anterior a la hora actual
        if (startDate < now) {
            Toast(
                "error",
                "No se pueden crear turnos en fechas u horas pasadas"
            );
            selectInfo.view.calendar.unselect();
            return;
        }

        // Verificar que haya clientes cargados
        if (clientes.length === 0) {
            AlertError(
                "No hay clientes disponibles. Por favor, agregue clientes primero."
            );
            selectInfo.view.calendar.unselect();
            return;
        }

        // Mostrar formulario para crear turno
        const turnoData = await promptCreateShift(clientes, startDate, endDate);

        if (turnoData) {
            try {
                await shiftsService.registrarTurno(
                    turnoData.fecha_hora_inicio,
                    turnoData.fecha_hora_fin,
                    turnoData.observaciones || "",
                    turnoData.cliente_id,
                    false
                );

                Toast("success", "Turno creado exitosamente");

                // Recargar turnos desde el backend
                if (calendarRef.current) {
                    const calendarApi = calendarRef.current.getApi();
                    calendarApi.refetchEvents();
                }
            } catch (error) {
                console.error("Error al crear turno:", error);
                AlertError(
                    `Error al crear turno: ${
                        error.response?.data?.message || error.message
                    }`
                );
            }
        }

        // Limpiar selección
        selectInfo.view.calendar.unselect();
    };

    // Manejar clic en fecha/hora (validación adicional)
    const handleDateClick = (info) => {
        const clickedDate = info.date;
        const now = new Date();

        // Prevenir clics en fechas/horas pasadas
        if (clickedDate < now) {
            Toast(
                "error",
                "No se pueden crear turnos en fechas u horas pasadas"
            );
            return;
        }
        // Si la fecha es válida, el evento 'select' se encargará de abrir el formulario
    };

    // Manejar inicio de arrastre de evento
    const handleEventDragStart = (info) => {
        draggedEventRef.current = info.event;
        setIsDraggingEvent(true);
    };

    // Manejar fin de arrastre de evento
    const handleEventDragStop = async (info) => {
        setIsDraggingEvent(false);

        // Verificar si el evento fue soltado sobre la zona de eliminación
        const deleteZone = document.getElementById("delete-zone");
        if (deleteZone) {
            const rect = deleteZone.getBoundingClientRect();
            const mouseX = info.jsEvent.clientX;
            const mouseY = info.jsEvent.clientY;

            const isOverDeleteZone =
                mouseX >= rect.left &&
                mouseX <= rect.right &&
                mouseY >= rect.top &&
                mouseY <= rect.bottom;

            if (isOverDeleteZone) {
                const turnoId = info.event.id;
                const turnoTitle = info.event.title;

                try {
                    // Eliminar del backend
                    await shiftsService.eliminarTurno(turnoId);

                    // Remover el evento del calendario
                    info.event.remove();

                    Toast("success", `Turno eliminado: ${turnoTitle}`);
                } catch (error) {
                    console.error("Error eliminando turno:", error);
                    Toast(
                        "error",
                        `Error: ${
                            error.response?.data?.message || error.message
                        }`
                    );
                    // Revertir el cambio visual si hubo error
                    info.revert();
                }
            }
        }

        draggedEventRef.current = null;
    };

    // Manejar clic en evento (mostrar detalles)
    const handleEventClick = (info) => {
        showShiftDetails({
            title: info.event.title,
            start: info.event.start,
            end: info.event.end,
            extendedProps: info.event.extendedProps,
        });
    };

    return (
        <div className="calendar-container">
            <FullCalendar
                ref={calendarRef}
                locale={customEsLocale}
                plugins={[
                    dayGridPlugin,
                    interactionPlugin,
                    timeGridPlugin,
                    momentTimezonePlugin,
                ]}
                timeZone="America/Argentina/Buenos_Aires"
                views={{
                    dayGridMonth: {
                        titleFormat: (date) => {
                            return `${monthNames[date.date.month]} ${
                                date.date.year
                            }`;
                        },
                        fixedWeekCount: false,
                    },
                    timeGridWeek: {
                        titleFormat: (date) => {
                            const startDay = date.start.day;
                            const endDay = date.end.day;
                            const startMonth = date.start.month;
                            const endMonth = date.end.month;
                            const year = date.start.year;

                            return `Semana ${startDay} de ${shortMonthNames[startMonth]} - ${endDay} de ${shortMonthNames[endMonth]} ${year}`;
                        },
                        allDaySlot: false,
                    },
                    timeGridDay: {
                        titleFormat: (date) => {
                            const year = date.date.year;
                            const month = date.date.month;
                            const dayOfMonth = date.date.day;
                            const correctDate = new Date(
                                year,
                                month,
                                dayOfMonth
                            );
                            const dayOfWeekIndex = correctDate.getDay();

                            return `${dayNames[dayOfWeekIndex]} ${dayOfMonth} de ${monthNames[month]} ${year}`;
                        },
                        allDaySlot: false,
                    },
                }}
                select={handleSelect}
                dateClick={handleDateClick}
                selectable={true}
                selectMirror={true}
                navLinks={true}
                nowIndicator={true}
                droppable={true}
                eventReceive={handleEventReceive}
                eventClick={handleEventClick}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: "today prev,next",
                    center: "title",
                    end: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                height={"95vh"}
                slotLabelFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }}
                eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                expandRows={true}
                events={loadShifts}
                editable={true}
                dayMaxEvents={true}
                eventLongPressDelay={500}
                eventDragStart={handleEventDragStart}
                eventDragStop={handleEventDragStop}
                // unselectAuto={true}
                // unselectCancel=".custom-button"     debería funcionar con eventos de forma similar
                eventResizeStart={(info) => {
                    if (currentView === "dayGridMonth") {
                        info.revert();
                        return false;
                    }
                }}
                viewDidMount={(info) => setCurrentView(info.view.type)}
                eventDidMount={(info) => {
                    if (currentView === "dayGridMonth") {
                        info.el
                            .querySelectorAll(".fc-event-resizer")
                            .forEach(
                                (handle) => (handle.style.display = "none")
                            );
                    }
                }}
            />
        </div>
    );
};
export default Calendar;
