import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Container, Row } from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
import './dateRangePicker.css';
const moment = require('moment-timezone');
moment.tz.setDefault('UTC');

class DateRangePicker extends Component {
  state = {
    startDate: null,
    endDate: null
  };

  handleChangeStart = date => {
    this.setState(
      {
        startDate: date
      },
      function() {
        this.props.onChangeStartDate(date);
      }
    );
  };

  handleChangeEnd = date => {
    this.setState(
      {
        endDate: date
      },
      function() {
        this.props.onChangeEndDate(date);
      }
    );
  };

  render() {
    return (
      <Container>
        <Row>
          <DatePicker
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStart}
            isClearable={true}
            placeholderText="Last Update Start Date"
            className="my-datepicker"
          />

          <DatePicker
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEnd}
            isClearable={true}
            placeholderText="Last Update End Date"
            className="my-datepicker"
          />
        </Row>
      </Container>
    );
  }
}

export default DateRangePicker;
