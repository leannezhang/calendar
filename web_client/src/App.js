import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import CalendarContainer from "./CalendarContainer";

function App() {
  return (
    <Router>
      <Route path="/" component={CalendarContainer} />
    </Router>
  );
}

export default App;
