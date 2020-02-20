import React from 'react';

class Welcome extends React.Component {
  constructor (props) {
    this.state = {
      isLoaded: false,
    }
  }
  componentDidMount () {
    this.setState({
      isLoaded: true
    })
  }
  render() {
    return <h1>{`Welcome ${this.props.name}`}</h1>;
  }
}

class Greeting extends React.Component {
  constructor (props) {
    this.state = {
      isLoaded: false,
    }
  }
  componentDidMount () {
    this.setState({
      isLoaded: true
    })
  }
  render() {
    return <h1>{`Hello ${this.props.name}`}</h1>;
  }
}
