import React, { Component } from 'react';
import PropTypes from 'prop-types';

/** Deprecated class. Show the loading animation. */
class Loading extends Component {
  /** Setting state and styles.
    * @param {object} props is the object that contains the props information for the component.
    * @return {null} No return.
  */
  constructor(props) {
    super(props);
    this.state = {
      text: props.text
    };
    this.styles = {
      content: {
        textAlign: 'center',
        fontSize: '35px'
      },
      icon: {
        fontSize: '25px',
        margin: '0 15px 0 0 '
      }
    };
  }

  /** When the component was mounted, setup a new interval to change the text and check whether should reset the text.
    * @return {null} No return.
  */
  componentDidMount() {
    const stopper = `${this.props.text}...`;
    // console.log("Stopper:      "+stopper);
    // console.log(this.state.text);
    this.interval = window.setInterval(() => {
    // console.log(this.state.text);
      if (this.state.text === stopper) {
      // console.log("Stop");
        this.setState({ text: this.props.text });
      } else {
      // console.log("setState");
        this.setState((prevousState) => ({ text: `${prevousState.text}.` }));
      }
    }, this.props.speed);
  }

  /* If props send a isLoading false, the component does not have to be rended */

  /** Clear the interval method when the component will be unmounted.
    * @return {null} No return.
  */
  componentWillUnmount() {
  // console.log("Will Unmount");
    window.clearInterval(this.interval);
  }

  /** The render method for the component.
    * @return {jsx} Return the jsx for the component.
  */
  render() {
    if (this.props.isLoading) {
      return (
        <p style={this.styles.content}>
          <i className="fa fa-spinner fa-pulse fa-3x fa-fw" style={this.styles.icon} />{this.state.text}
        </p>);
    } return null;
  }
}

Loading.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number,
  isLoading: PropTypes.bool
};
Loading.defaultProps = {
  text: 'Loading',
  speed: 300,
  isLoading: true
};

export default Loading;
