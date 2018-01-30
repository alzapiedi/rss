import React, { Component } from 'react';

export default class Root extends Component {
  state = {
    entries: []
  }

  componentDidMount() {
    fetch('http://localhost:3000/all')
      .then(res => res.json())
      .then(json => this.setState({ entries: json.entries }))
      .catch(e => console.log(e.message))
  }

  render() {
    window.comp = this;
    return (
      <div>
        {this.state.entries.map(this.renderEntry, this)}
      </div>
    );
  }

  renderEntry(entry) {
    return <div>{entry.title}</div>;
  }

  updateStore = () => {
    fetch('http://localhost:3000/update', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify({ entries: this.state.entries })
    });
  }
}
