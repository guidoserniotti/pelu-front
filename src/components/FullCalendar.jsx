import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import "../styles/calendar.css";
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

    return (
        <div className="calendar-container">
            <FullCalendar
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
                dateClick={(e) => {
                    /* TO-DO: Manejar clic en fecha */
                }}
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
                events={[]} // Aquí se debe agregar la lógica para cargar eventos dinámicamente
                editable={true}
                dayMaxEvents={true}
                eventLongPressDelay={500}
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
