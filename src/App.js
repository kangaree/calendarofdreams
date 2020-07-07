import React from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import nyy from "./nyy.json";

const nyySchedule = nyy.map((game) => {
  const startMoment = moment(game["START DATE"] + " " + game["START TIME"]);
  const endMoment = moment(game["END DATE"] + " " + game["END TIME"]);

  return {
    start: startMoment.toDate(),
    end: endMoment.toDate(),
    title: game["SUBJECT"],
  };
});

const localizer = momentLocalizer(moment);

class App extends React.Component {
  
  state = {
    events: nyySchedule,
  };

  render = () => {
    return (
      <div className="App">
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={this.state.events}
          style={{ height: "100vh" }}
        />
      </div>
    );
  };
}

export default App;
