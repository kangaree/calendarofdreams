import React from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./rbc.css";

import MLBStatsAPI from "mlb-stats-api";

import teamnames from "./teamnames.json"

const mlbStats = new MLBStatsAPI();

const localizer = momentLocalizer(moment);

function Event({ event }) {
  return (
    <span style={{ textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span>{event.data.teams.away.score}</span>
        <div
          style={{
            width: 40,
            height: 20,
            backgroundImage: `url("./logos/${
              event.title.split(" at ")[0]
            }.png")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "50% 50%",
          }}
        />
        <span>@</span>
        <div
          style={{
            width: 40,
            height: 20,
            backgroundImage: `url("./logos/${
              event.title.split(" at ")[1]
            }.png")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "50% 50%",
          }}
        />
        <span>{event.data.teams.home.score}</span>
      </div>
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
    unfilteredEvents: [],
    team: "MLB",
  };

  async componentDidMount() {

    const response = await mlbStats.getSchedule({
      params: {
        sportId: 1,
        // TODO: dynamically change every new year
        startDate: "04/01/2021",
        endDate: "12/31/2021",
      },
    });

    const dates = response.data.dates;
    const games = dates.reduce((acc, curr) => [...acc, ...curr.games], []);

    const schedule = games.map((game) => {
      const startMoment = moment(game.gameDate);
      let endMoment = moment(game.gameDate).add(1, "hours");

      return {
        start: startMoment.toDate(),
        end: endMoment.toDate(),
        title:
          teamnames[game.teams.away.team.name] +
          " at " +
          teamnames[game.teams.home.team.name],
        desc: game.venue.name,
        data: game,
      };
    });

    this.setState({
      events: schedule,
      unfilteredEvents: schedule,
    })
  }

  handleChange = (event) => {
    this.setState({ team: event.target.value });

    if (event.target.value === "MLB") {
      this.setState({events: this.state.unfilteredEvents})
    } else {
      this.setState({
        events: this.state.unfilteredEvents.filter((baseballEvent) =>
          baseballEvent.title.includes(event.target.value)
        ),
      });
    }

  }

  render = () => {
    return (
      <div className="App">
        <div style={{ height: "5vh" }}>
          <select value={this.state.team} onChange={this.handleChange}>
            <option value="MLB">MLB</option>
            {Object.keys(teamnames).map((name) => (
              <option value={teamnames[name]}>{name}</option>
            ))}
          </select>
        </div>
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          events={this.state.events}
          style={{ height: "95vh" }}
          components={{
            event: Event,
          }}
          // 60 day regular season sprint + 30
          length={90}
          // noon start
          min={new Date(0, 0, 0, 12, 0, 0)}
          // views={["month", "week", "agenda"]}
          // formats={{ eventTimeRangeFormat: "spagett" }}
          formats={{
            eventTimeRangeFormat: ({ start }) => moment(start).format("h:mm A"),
            agendaTimeRangeFormat: ({ start }) =>
              moment(start).format("h:mm A"),
          }}
          popup
          onSelectEvent={() => console.log("an event has been selected")}
        />
      </div>
    );
  };
}

export default App;
