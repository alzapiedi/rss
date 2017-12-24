import React, { Component } from 'react';

export default class Root extends Component {
  render() {
    return (
      <div id="map" />
    );
  }

  componentDidMount() {
    const cityHall = { lat: 39.952575, lng: -75.163836 };
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: cityHall
    });
    fetch('/news').then(r => r.json()).then(r => r.entries.map(this.drawEntry));
  }

  drawEntry = entry => {
    new window.google.maps.Marker({
      position: entry.location,
      map: this.map,
      title: entry.title
    });
  }
}
