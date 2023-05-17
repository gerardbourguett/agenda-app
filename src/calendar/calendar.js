import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { createClient } from '@supabase/supabase-js';


const supabase = createClient('https://zqdducbnmvfkraxcgvaw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZGR1Y2JubXZma3JheGNndmF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzMwNzQzMiwiZXhwIjoxOTk4ODgzNDMyfQ.GXAlfjG0EjYibdcD-6guITRHN9g3G0ce_Pqh_6R5ZyM'); // Reemplaza con tus credenciales de Supabase

function Calendar() {
    const [events, setEvents] = useState([]);

    const addEvent = (newEvent) => {
        setEvents([...events, newEvent]);
    };

    // Función para crear un evento con las propiedades específicas
    const createEvent = (title, start, end, tipoAudiencia, sala, magis, abo_patrocinante, observaciones) => {
        const newEvent = {
            id: events.length + 1, // Generar un id único para el evento (puede ser autoincremental)
            title,
            start,
            end,
            tipoAudiencia,
            sala,
            magis,
            abo_patrocinante,
            textColor: '#000000', // Color de texto (por ejemplo, blanco)
            backgroundColor: getBackgroundColor(tipoAudiencia), // Color de fondo basado en el tipo de audiencia
            observaciones,
        };

        addEvent(newEvent);
    };

    // Función para obtener el color de fondo basado en el tipo de audiencia
    const getBackgroundColor = (tipoAudiencia) => {
        // Lógica para asignar un color de fondo específico según el tipo de audiencia
        // Puedes implementar tu propia lógica aquí

        // Ejemplo: Asignar color azul para audiencias de tipo "A" y color rojo para audiencias de tipo "B"
        if (tipoAudiencia === 'A') {
            return '#0000FF';
        } else if (tipoAudiencia === 'B') {
            return '#FF0000';
        }

        // Si el tipo de audiencia no coincide con ningún caso, se puede devolver un color predeterminado
        return '#CCCCCC';
    };


    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase.from('audiencias').select('*');
            if (error) {
                throw new Error(error.message);
            }
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                weekends={false}
                events={events}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                select={async ({ start, end }) => {
                    const title = window.prompt('Nombre de la audiencia:');
                    if (title) {
                        try {
                            const { data, error } = await supabase.from('audiencias').insert([
                                { title, start, end }
                            ]);
                            if (error) {
                                throw new Error(error.message);
                            }
                            setEvents([...events, ...data]);
                        } catch (error) {
                            console.error('Error inserting event:', error);
                        }
                    }
                }}
                timeZone='America/Santiago'
                slotDuration={'00:15:00'}
                slotMinTime={'08:00:00'}
                slotMaxTime={'16:00:00'}
                slotLabelFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    omitZeroMinute: false,
                    meridiem: 'short',
                }}
                allDaySlot={false}
                locale={'es'}
                buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día',
                    list: 'Lista'
                }}

            />


        </div>

    );
}

export default Calendar;
