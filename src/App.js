import React from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./rbc.css";

import mlb from "./mlb.json";

const mlbSchedule = mlb
  .map((game) => {
    const startMoment = moment(game["START DATE"] + " " + game["START TIME"]);
    const endMoment = moment(game["END DATE"] + " " + game["END TIME"]);

    return {
      start: startMoment.toDate(),
      end: endMoment.toDate(),
      title: game["SUBJECT"],
      desc: game["LOCATION"],
    };
  });

const localizer = momentLocalizer(moment);

function Event({ event }) {
  return (
    <span style={{ textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            backgroundImage: `url("./logos/${
              event.title.split(" at ")[0]
            }.png")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "50% 50%",
          }}
        />
        <div
          style={{
            width: 40,
            height: 40,
            backgroundImage: `url("./logos/${
              event.title.split(" at ")[1]
            }.png")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "50% 50%",
          }}
        />
      </div>
      <div>
        <strong>
          {event.title.split(" at ")[0]} @ {event.title.split(" at ")[1]}
        </strong>
      </div>
      <div style={{fontSize: 12}}>{event.desc && event.desc}</div>
    </span>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    events: [],
    team: "Yankees",
  };

  componentDidMount() {
    this.setState({
      events: mlbSchedule.filter((event) =>
        event.title.includes(this.state.team)
      ),
    });
  }

  handleTeam = (teamValue) => {
    console.log("new team");
    this.setState({ language: teamValue });
  };

  handleChange = (event) => {
    this.setState({ team: event.target.value });
    this.setState({
      events: mlbSchedule.filter((baseballEvent) =>
        baseballEvent.title.includes(event.target.value)
      ),
    });
  }

  render = () => {
    return (
      <div className="App">
        <div style={{ height: "5vh" }}>
          <select value={this.state.team} onChange={this.handleChange}>
            <option value="Yankees">Yankees</option>
            <option value="Orioles">Orioles</option>
            <option value="Red Sox">Red Sox</option>
            <option value="Rays">Rays</option>
            <option value="Blue Jays">Blue Jays</option>
            <option value="White Sox">White Sox</option>
            <option value="Indians">Indians</option>
            <option value="Tigers">Tigers</option>
            <option value="Royals">Royals</option>
            <option value="Twins">Twins</option>
            <option value="Astros">Astros</option>
            <option value="Angels">Angels</option>
            <option value="Athletics">Athletics</option>
            <option value="Mariners">Mariners</option>
            <option value="Rangers">Rangers</option>
            <option value="Braves">Braves</option>
            <option value="Marlins">Marlins</option>
            <option value="Mets">Mets</option>
            <option value="Phillies">Phillies</option>
            <option value="Nationals">Nationals</option>
            <option value="Cubs">Cubs</option>
            <option value="Reds">Reds</option>
            <option value="Brewers">Brewers</option>
            <option value="Pirates">Pirates</option>
            <option value="Cardinals">Cardinals</option>
            <option value="Diamondbacks">Diamondbacks</option>
            <option value="Rockies">Rockies</option>
            <option value="Dodgers">Dodgers</option>
            <option value="Padres">Padres</option>
            <option value="Giants">Giants</option>
          </select>
        </div>
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={this.state.events}
          style={{ height: "95vh" }}
          components={{
            event: Event,
          }}
          // 60 day regular season sprint + 30
          length={90}
          // noon start
          min={new Date(0, 0, 0, 12, 0, 0)}
          views={["month", "week", "agenda"]}
        />
      </div>
    );
  };
}

export default App;
