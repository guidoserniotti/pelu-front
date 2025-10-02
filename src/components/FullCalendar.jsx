import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState } from "react";

const Calendar = () => {
    const [currentView, setCurrentView] = useState("timeGridWeek");

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
        "🎄Dic🎄",
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
    const dayNamesShort = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

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

    return (
        <div className="calendar-container">
            <FullCalendar
                locale={customEsLocale}
                views={{
                    dayGridMonth: {
                        titleFormat: (date) =>
                            `${monthNames[date.date.month]} ${date.date.year}`,
                    },
                    timeGridWeek: {
                        titleFormat: (date) =>
                            `Semana ${date.start.day} de ${
                                shortMonthNames[date.start.month]
                            } - ${date.end.day} de ${
                                shortMonthNames[date.end.month]
                            } ${date.start.year}`,
                        allDaySlot: false,
                    },
                    timeGridDay: {
                        titleFormat: (date) =>
                            `${dayNames[date.date.day]} ${date.date.day} de ${
                                monthNames[date.date.month]
                            } ${date.date.year}`,
                        allDaySlot: false,
                    },
                }}
                dateClick={(e) => {}}
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: "today prev,next",
                    center: "title",
                    end: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                height={"95vh"}
                dayHeaderFormat={(date) =>
                    dayNamesShort[date.date.marker.getDay()]
                }
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
                events={[
                    { title: "event 1", date: "2025-10-01" },
                    { title: "event 2", date: "2025-10-02" },
                ]}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={false}
                selectLongPressDelay={250}
                selectMinDistance={5}
                unselectAuto={true}
                unselectCancel=".custom-button"
                select={(selectInfo) => {
                    console.log("Rango seleccionado:", selectInfo);
                }}
                unselect={() => console.log("Selección cancelada")}
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
