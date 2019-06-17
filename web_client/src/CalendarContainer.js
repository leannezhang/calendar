import React from "react";
import moment from "moment";
import Calendar from "./Calendar";
const dateRegex = /(\d{4})\/(\d{1,2})/;

export default class CalendarContainer extends React.Component {
  state = {
    date: null, // default to current month
    dateToString: ""
  };

  _setDefaultDate() {
    const date = moment().startOf("month");

    return {
      date: date, // default to current month
      dateToString: date.format("LLLL")
    };
  }

  componentDidMount() {
    const path = this.props.location.pathname;
    const matches = dateRegex.exec(path);
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
        dateToString: date.format("LLLL")
      });
    }
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
        {date ? <Calendar date={date} dateToString={dateToString} /> : null}
      </div>
    );
  }

  _handlePreviousMonthClick = () => {
    const previousMonth = moment(this.state.date).subtract(1, "months");

    this.setState({
      date: previousMonth,
      dateToString: previousMonth.format("LLLL")
    });
  };

  _handleNextMonthClick = () => {
    const nextMonth = moment(this.state.date).add(1, "months");
    this.setState({
      date: nextMonth,
      dateToString: nextMonth.format("LLLL")
    });
  };
}
