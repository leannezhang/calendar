import React from "react";
import "./Calendar.css";
import PropTypes from "prop-types"; // ES6

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const OFFSETMAP = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};

export default class Calendar extends React.Component {
  static propTypes = {
    date: PropTypes.object,
    movies: PropTypes.object
  };

  state = {
    calendar: this._buildCalendar()
  };

  componentDidUpdate(prevProps) {
    if (prevProps.dateToString !== this.props.dateToString) {
      this.setState({
        calendar: this._buildCalendar()
      });
    }
  }

  _buildCalendar() {
    const { date } = this.props;
    const start = date.format("ddd");
    const numberOfDays = date.daysInMonth();
    const startIndex = OFFSETMAP[start];

    const numberOfRows = Math.ceil((numberOfDays + startIndex) / 7);

    let calendar = [];
    let firstRow = [" ", " ", " ", " ", " ", " ", " "];
    let daySofar = 1;

    for (let d = startIndex; d < 7; d++) {
      firstRow[d] = daySofar;
      daySofar++;
    }
    calendar.push(firstRow);
    // rest of rows
    for (let r = 2; r <= numberOfRows; r++) {
      let row = [" ", " ", " ", " ", " ", " ", " "];
      for (let d = 0; d < 7 && daySofar <= numberOfDays; d++) {
        row[d] = daySofar++;
      }
      calendar.push(row);
    }
    return calendar;
  }

  _renderHeader() {
    return (
      <div className="header">
        {DAYS.map(dayLabel => {
          return (
            <div className="day" key={dayLabel}>
              {dayLabel}
            </div>
          );
        })}
      </div>
    );
  }

  _renderWeeks() {
    const { movies } = this.props;
    const weeks = this.state.calendar.map((week, i) => {
      return (
        <div key={i} className="week">
          {week.map((day, i) => {
            return (
              <div key={i} className="day">
                {day}
                {movies && movies[day] ? (
                  <div className="movies">
                    {movies[day].map(movie => {
                      return <div key={movie.id}>{movie.title}</div>;
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      );
    });
    return weeks;
  }

  render() {
    return (
      <div>
        <div className="calendarContainer">
          {this._renderHeader()}
          <div>{this._renderWeeks()}</div>
        </div>
      </div>
    );
  }
}
