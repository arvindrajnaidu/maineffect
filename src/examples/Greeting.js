import React from 'react';

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
