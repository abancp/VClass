
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { SERVER_URL } from "../../config/SERVER_URL";
import axios from "axios";
import { toast } from "sonner";

const localizer = momentLocalizer(moment);

const VClassCalendar = ({ id }) => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("month"); // Manage active view
  const [date, setDate] = useState(new Date()); // Manage current date
  const today = moment().startOf("day");

  useEffect(() => {
    let firstDate = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0).getTime();
    let lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0, 0).getTime();
    axios.get(SERVER_URL + "/event/" + id + "/between/" + firstDate + "/" + lastDate, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          console.log(data)
          for(const e of data.events){
            e.start = new Date(e.start)
            e.end = new Date(e.end)
          }
          setEvents(data.events)
        }
      })
  }, [date, id])

  const handleSelect = ({ start, end }) => {
    const title = window.prompt("Enter event title:");
    if (title) {
      console.log(start.getTime(), end.getTime())
      axios.post(SERVER_URL + "/event/", { start: start.getTime(), end: end.getTime(), title, class_id: id }, { withCredentials: true })
        .then(({ data }) => {
          if (data.success) {
            toast.success("Event Added!")
            setEvents([...events, { start, end, title }]);
          } else {
            toast.error("something went wrong : " + data.message)
          }
        })
        .catch(() => { toast.error("something went wrong!") })
    }
  };

  useEffect(() => {
    console.log(events)
  }, [events])

  const handlePropGetter = (date) => {
    if (moment(date).isSame(today, "day")) {
      return {
        style: {
          backgroundColor: "#1192B8", // Special color for today
          color: "black", // Text color
        },
      };
    }
    return {
    };
  }

  return (
    <div className="max-w-5xl mx-auto p-4 bg-dark rounded-xl shadow-lg">
      <div className="border rounded-lg overflow-hidden">
        <Calendar
          dayPropGetter={handlePropGetter}
          localizer={localizer}
          events={events}
          selectable
          onSelectSlot={handleSelect}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, border: "1px solid #2a243e" }}
          className="p-2"
          date={date}
          view={view}
          onNavigate={(newDate) => setDate(newDate)}
          onView={(newView) => setView(newView)}
        />
      </div>
    </div>
  );
};

export default VClassCalendar;

