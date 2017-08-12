import React, {Component} from "react";
import PropTypes from "prop-types";

class Loading extends Component {

constructor(props){
  super(props);
  this.state={
    text: props.text
  };
  this.styles={
    content:{
      textAlign: "center",
      fontSize: "35px"
    },
    icon:{
      fontSize: "25px",
      margin: "0 15px 0 0 "
    }
  };
}

componentDidMount(){
  var stopper=this.props.text+"...";
  // console.log("Stopper:      "+stopper);
  // console.log(this.state.text);
  this.interval = window.setInterval(()=>{
    // console.log(this.state.text);
    if(this.state.text==stopper){
      // console.log("Stop");
      this.setState({text: this.props.text});
    }else{
      // console.log("setState");
      this.setState((prevousState)=>{
        return {text: prevousState.text+"."};
      });
    }
  }, this.props.speed);
}

/* If props send a isLoading false, the component does not have to be rended */


componentWillUnmount(){
  // console.log("Will Unmount");
  window.clearInterval(this.interval);
}

  render(){
    if (this.props.isLoading) {
      return (
        <p style={this.styles.content}>
          <i className="fa fa-spinner fa-pulse fa-3x fa-fw" style={this.styles.icon} />{this.state.text}
        </p>);
    } else return null;

  }
}

Loading.propTypes={
  text: PropTypes.string,
  speed: PropTypes.number,
  isLoading: PropTypes.bool
};
Loading.defaultProps={
  text: "Loading",
  speed: 300,
  isLoading: true // TODO should be removed after transform all code to use new format of Loading component
};

export default Loading;
