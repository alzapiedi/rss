import React, { Component } from 'react';

const locations = [
  { name: 'Wells Fargo', coordinates: { latitude: 39.90122, longitude: -75.172 } },
  { name: 'Linc', coordinates: { latitude: 39.900755, longitude: -75.167452 } },
  { name: 'Citizens bank park', coordinates: { latitude: 39.905891, longitude: -75.166554 } },
  { name: 'City hall', coordinates: { latitude: 39.952364, longitude: -75.163619 } },
  { name: 'Art museum', coordinates: { latitude: 39.965558, longitude: -75.180917 } }
];

export default class Root extends Component {
  state = {
    entries: []
  }

  componentDidMount() {
    window.comp = this;
    fetch('http://108.4.212.129:4000/rss')
      .then(res => res.json())
      .then(json => this.setState({ entries: json.entries }))
      .catch(e => console.log(e.message))
  }

  render() {
    return (
      <div>
        {this.state.entries.map(this.renderEntry, this)}
      </div>
    );
  }

  renderEntry(entry, idx) {
    return (
      <div id={`entry${idx}`} key={entry.link} className="entry">
        <a href={entry.link}>{entry.title}</a>
        <div>
          <label>lat</label>
          <input onChange={this.changeLat.bind(this, entry)}/>
          <label>lng</label>
          <input onChange={this.changeLng.bind(this, entry)}/>
          <label>emoji name</label>
          <input onChange={this.changeEmoji.bind(this, entry)}/>
          <button onClick={this.addToDB.bind(this, entry)}>Add</button>
          <button onClick={this.hide.bind(this, idx)}>Hide</button>
        </div>
      </div>
    );
  }

  hide = idx => {
    document.getElementById(`entry${idx}`).style.display = 'none';
  }

  changeLat = (entry, event) => {
    const { entries } = this.state;
    const idx = entries.findIndex(e => e.title === entry.title);
    entries[idx].coordinates = { latitude: event.target.value, longitude: entries[idx].coordinates ? entries[idx].coordinates.longitude : null };
    this.setState({ entries });
  }

  changeLng = (entry, event) => {
    const { entries } = this.state;
    const idx = entries.findIndex(e => e.title === entry.title);
    entries[idx].coordinates = { latitude: entries[idx].coordinates ? entries[idx].coordinates.latitude : null, longitude: event.target.value };
    this.setState({ entries });
  }

  changeEmoji = (entry, event) => {
    const { entries } = this.state;
    const idx = entries.findIndex(e => e.title === entry.title);
    entries[idx].emoji = event.target.value;
    this.setState({ entries });
  }

  addToDB = entry => {
    if (!entry.coordinates || !entry.coordinates.latitude || !entry.coordinates.longitude || !entry.emoji) return alert('fill everything out plz');
    fetch('http://108.4.212.129:4000/add', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify({ entry })
    }).then(res => res.json()).then(json => {
      if (json.status === 'error') alert('Already in there bro');
    });
  }
}
