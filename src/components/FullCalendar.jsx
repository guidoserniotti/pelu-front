import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useCallback, useRef, useState } from "react";
import shiftsService from "../services/shifts";
import "../styles/calendar.css";
import windowDelete from "../utils/NotificationWindows/ConfirmDelete";
import showShiftDetails from "../utils/NotificationWindows/ShiftDetailsSidebar";
import { promptCreateShift } from "../utils/NotificationWindows/ShiftFormPrompt";
import confirmModify from "../utils/NotificationWindows/ConfirmModify";
import AlertError from "../utils/NotificationWindows/AlertError";
import { promiseToast, showValidation } from "../utils/toastify/toastConfig";
import { createDynamicMessage } from "../utils/toastify/toastMessages";

const Calendar = ({ clientList = [], setIsDraggingEvent, onShiftsLoaded }) => {
    const [currentView, setCurrentView] = useState("timeGridWeek");
    const calendarRef = useRef(null);
    const draggedEventRef = useRef(null);
    const hasLoadedOnce = useRef(false);

    const clientes = clientList.filter((client) => !client.esta_eliminado);

    const loadShifts = useCallback(async (fetchInfo) => {
        try {
            const today = new Date();
            const oneMonthAgo = new Date(today);
            oneMonthAgo.setMonth(today.getMonth() - 1);

            const elevenMonthsLater = new Date(today);
            elevenMonthsLater.setMonth(today.getMonth() + 11);

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

            if (!hasLoadedOnce.current && onShiftsLoaded) {
                hasLoadedOnce.current = true;
                onShiftsLoaded();
            }

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
        "Diciembre",
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
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado",
    ];

    const customEsLocale = {
        ...esLocale,
        buttonText: {
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Dia",
        },
    };

    const handleEventReceive = async (info) => {
        const clienteTitle = info.event.title;
        const clienteId = info.event.id;
        const startDate = info.event.start;
        const endDate = info.event.end;
        const now = new Date();

        if (currentView !== "dayGridMonth" && startDate < now) {
            showValidation("FECHA_PASADA");
            info.revert();
            return;
        }

        let cliente = clientes.find((c) => c.id === clienteId);

        if (!cliente) {
            cliente = clientes.find((c) => c.title === clienteTitle);
        }

        if (!cliente) {
            showValidation("CLIENTE_NO_IDENTIFICADO");
            info.revert();
            return;
        }

        const turnoData = await promptCreateShift(
            clientes,
            startDate,
            endDate,
            cliente.id
        );

        if (turnoData) {
            try {
                await promiseToast(
                    shiftsService.registrarTurno(
                        turnoData.fecha_hora_inicio,
                        turnoData.fecha_hora_fin,
                        turnoData.observaciones || "",
                        turnoData.cliente_id,
                        false
                    ),
                    createDynamicMessage.shiftCreate(cliente)
                );

                info.event.remove();

                if (calendarRef.current) {
                    const calendarApi = calendarRef.current.getApi();
                    calendarApi.refetchEvents();
                }
            } catch (error) {
                console.error("Error al crear turno:", error);
                info.revert();
            }
        } else {
            info.revert();
        }
    };

    const handleSelect = async (selectInfo) => {
        // En vista mes, el click navega al dia (manejado por handleDateClick)
        if (currentView === "dayGridMonth") {
            selectInfo.view.calendar.unselect();
            return;
        }

        const startDate = selectInfo.start;
        const endDate = selectInfo.end;
        const now = new Date();

        if (startDate < now) {
            showValidation("FECHA_PASADA");
            selectInfo.view.calendar.unselect();
            return;
        }

        if (clientes.length === 0) {
            showValidation("NO_CLIENTES");
            selectInfo.view.calendar.unselect();
            return;
        }

        const turnoData = await promptCreateShift(clientes, startDate, endDate);

        if (turnoData) {
            try {
                await promiseToast(
                    shiftsService.registrarTurno(
                        turnoData.fecha_hora_inicio,
                        turnoData.fecha_hora_fin,
                        turnoData.observaciones || "",
                        turnoData.cliente_id,
                        false
                    ),
                    createDynamicMessage.shiftCreate(turnoData.cliente_nombre)
                );

                if (calendarRef.current) {
                    const calendarApi = calendarRef.current.getApi();
                    calendarApi.refetchEvents();
                }
            } catch (error) {
                console.error("Error al crear turno:", error);
            }
        }

        selectInfo.view.calendar.unselect();
    };

    const handleDateClick = (info) => {
        if (currentView === "dayGridMonth" && calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.changeView("timeGridDay", info.date);
        }
    };

    const handleEventDragStart = (info) => {
        draggedEventRef.current = info.event;
        setIsDraggingEvent(true);
    };

    const handleEventDragStop = async (info) => {
        setIsDraggingEvent(false);

        const deleteZone = document.getElementById("delete-zone");
        if (deleteZone) {
            const rect = deleteZone.getBoundingClientRect();

            let mouseX, mouseY;

            if (
                info.jsEvent.type === "touchend" &&
                info.jsEvent.changedTouches
            ) {
                const touch = info.jsEvent.changedTouches[0];
                mouseX = touch.clientX;
                mouseY = touch.clientY;
            } else {
                mouseX = info.jsEvent.clientX;
                mouseY = info.jsEvent.clientY;
            }

            const isOverDeleteZone =
                mouseX >= rect.left &&
                mouseX <= rect.right &&
                mouseY >= rect.top &&
                mouseY <= rect.bottom;

            if (isOverDeleteZone) {
                const turnoId = info.event.id;
                const turnoTitle = info.event.title;
                const confirmDelete = await windowDelete("este turno", false);
                if (!confirmDelete) return;

                try {
                    await promiseToast(
                        shiftsService.eliminarTurno(turnoId),
                        createDynamicMessage.turnoDeleted(turnoTitle)
                    );

                    info.event.remove();
                } catch (error) {
                    console.error("Error eliminando turno:", error);
                    info.revert();
                }
            }
        }

        draggedEventRef.current = null;
    };

    const handleEventClick = (info) => {
        showShiftDetails(
            {
                title: info.event.title,
                start: info.event.start,
                end: info.event.end,
                extendedProps: info.event.extendedProps,
            },
            () => {
                if (calendarRef.current) {
                    const calendarApi = calendarRef.current.getApi();
                    calendarApi.refetchEvents();
                }
            }
        );
    };

    const handleEventChange = async (info) => {
        const turnoId = info.event.id;
        const now = new Date();

        if (currentView !== "dayGridMonth" && info.event.start < now) {
            showValidation("TURNO_MOVER_PASADO");
            info.revert();
            return;
        }

        const confirm = await confirmModify(info.event.title);
        if (!confirm) {
            info.revert();
            return;
        }

        try {
            const fechaInicioISO = info.event.start.toISOString();
            const fechaFinISO = info.event.end
                ? info.event.end.toISOString()
                : fechaInicioISO;

            await promiseToast(
                shiftsService.editarTurno(turnoId, {
                    fecha_hora_inicio_turno: fechaInicioISO,
                    fecha_hora_fin_turno: fechaFinISO,
                    observaciones:
                        info.event.extendedProps.observaciones || null,
                }),
                createDynamicMessage.shiftUpdate(info.event.title)
            );
        } catch (error) {
            console.error("Error actualizando turno:", error);
            info.revert();
        }
    };

    const handleEventResize = async (info) => {
        const now = new Date();

        if (currentView !== "dayGridMonth") {
            if (
                info.event.start < now ||
                (info.event.end && info.event.end < now)
            ) {
                showValidation("TURNO_REDIMENSIONAR_PASADO");
                info.revert();
                return;
            }
        }
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
                eventChange={handleEventChange}
                eventResize={handleEventResize}
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
                slotDuration="00:15:00"
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                expandRows={true}
                events={loadShifts}
                editable={true}
                dayMaxEvents={true}
                slotEventOverlap={false}
                eventLongPressDelay={300}
                longPressDelay={300}
                eventDragStart={handleEventDragStart}
                eventDragStop={handleEventDragStop}
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
