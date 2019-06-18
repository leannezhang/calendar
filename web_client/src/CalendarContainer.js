import React from "react";
import moment from "moment";
import Calendar from "./Calendar";

const DATE_REGEX = /(\d{4})\/(\d{1,2})/;
const DATE_FORMAT = "MMMM YYYY";
const URL =
  "https://gist.githubusercontent.com/dannycochran/697345c1f21aa8c40e6925f9a8c0e0b0/raw/a1c0ecf3813af6c19285160dcadde0a446a9bb65/events.json";
export default class CalendarContainer extends React.Component {
  state = {
    date: null, // default to current month
    dateToString: "",
    data: []
  };

  async componentDidMount() {
    const data = await this._loadData();
    if (data) {
      this.setState({ data: data.data });
    }

    const path = this.props.location.pathname;
    const matches = DATE_REGEX.exec(path);
    if (!matches) {
      this.setState({ ...this._setDefaultDate() });
      return;
    }

    const year = matches[1];
    const month = matches[2];
    if (month >= 1 && month <= 12) {
      const date = moment(`${year}-${month}`, "YYYY-MM");
      this.setState({
        date: date,
        dateToString: date.format(DATE_FORMAT)
      });
    }
  }

  _setDefaultDate() {
    const date = moment().startOf("month");

    return {
      date: date, // default to current month
      dateToString: date.format(DATE_FORMAT)
    };
  }

  async _loadData() {
    const response = await fetch(URL);
    return await response.json();
  }

  render() {
    const { date, dateToString } = this.state;
    return (
      <div className="app">
        <header className="dateHeader">
          {dateToString}
          <button onClick={this._handlePreviousMonthClick}>Previous</button>
          <button onClick={this._handleNextMonthClick}>Next</button>
        </header>
        {date ? (
          <Calendar
            date={date}
            movies={this._getSelectedMonthMovies()}
            dateToString={dateToString}
          />
        ) : null}
      </div>
    );
  }

  _handlePreviousMonthClick = () => {
    const previousMonth = moment(this.state.date).subtract(1, "months");

    this.setState({
      date: previousMonth,
      dateToString: previousMonth.format(DATE_FORMAT)
    });
  };

  _handleNextMonthClick = () => {
    const nextMonth = moment(this.state.date).add(1, "months");
    this.setState({
      date: nextMonth,
      dateToString: nextMonth.format(DATE_FORMAT)
    });
  };

  _getSelectedMonthMovies() {
    const { dateToString } = this.state;
    const moviesMap = this._transformedData();
    // console.log(moviesMap[dateToString]);
    return moviesMap[dateToString];
  }

  /**
   * Transformed data example
   * {"June 2018:": {
        28: [
          {
            id: "id",
            launch_date: "launch_date",
            title: "title"
          },
          {
            id: "id",
            launch_date: "launch_date",
            title: "title"
          }
        ],
        ...,
      }
   */

  _transformedData() {
    const { data } = this.state;
    const transformedData = {};

    data.forEach(movie => {
      let launch_date = moment(movie.launch_date);
      let month_year = launch_date.format(DATE_FORMAT);
      let day = launch_date.date();

      // Create month_year as key if month_year does not exist
      if (!transformedData[month_year]) {
        transformedData[month_year] = {
          [day]: [
            {
              ...movie
            }
          ]
        };
      } else {
        // Create day as key if day doesn't exist
        if (!transformedData[month_year][day]) {
          transformedData[month_year] = {
            ...transformedData[month_year],
            [day]: [
              {
                ...movie
              }
            ]
          };
        } else {
          transformedData[month_year][day].push({
            ...movie
          });
        }
      }
    });
    return transformedData;
  }
}
