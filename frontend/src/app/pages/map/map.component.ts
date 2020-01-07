import {Component, OnInit} from '@angular/core';
import {Layer} from "mapbox-gl";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  earthquakes: object;
  clusterLayers: Layer[];

  async ngOnInit() {
    //this.earthquakes = await import('./earthquakes.json');
    const layersData: [number, string][] = [
      [0, 'green'],
      [20, 'orange'],
      [200, 'red']
    ];
    this.clusterLayers = layersData.map((data, index) => ({
      id: `cluster-${index}`,
      paint: {
        'circle-color': data[1],
        'circle-radius': 70,
        'circle-blur': 1
      },
      filter: index === layersData.length - 1 ?
        ['>=', 'point_count', data[0]] :
        ['all',
          ['>=', 'point_count', data[0]],
          ['<', 'point_count', layersData[index + 1][0]]
        ]
    }));
  }
}
