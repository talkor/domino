import React from 'react';
import './Timer.css';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsedSeconds: 0
    };
  }

  render() {
    const minutes = parseInt(this.state.elapsedSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.state.elapsedSeconds % 60)
      .toString()
      .padStart(2, '0');

    return (
      <div className="timer">
        <span className="timer-minutes">{minutes}</span>:
        <span className="timer-seconds">{seconds}</span>
      </div>
    );
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ elapsedSeconds: this.state.elapsedSeconds + 1 });
    }, 1000);
  }

  componentWillUnmount() {
    this.stop();
  }

  stop() {
    clearInterval(this.interval);
  }
}

export default Timer;
