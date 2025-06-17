import { Component, OnInit } from '@angular/core';

import * as L                                   from 'leaflet';

@Component({
    selector: 'app-map',
    imports: [],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  map!: L.Map;

  ngOnInit(): void {
    // MAP
    this.map = L.map('map', {
      center: [50.9, 4.3],
      zoom: 7,
      zoomControl: false
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    // add scale control
    L.control.scale({position: 'bottomleft', imperial: true, metric: true}).addTo(this.map);
  }

}
