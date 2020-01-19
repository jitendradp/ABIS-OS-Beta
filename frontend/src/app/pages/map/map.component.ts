import {Component, OnInit} from '@angular/core';
import {Layer} from "mapbox-gl";
import {MatSlideToggleChange} from "@angular/material";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  mapStyle = "mapbox://styles/mapbox/streets-v9";
  dark: boolean = false;
  selectedCluster: { geometry: GeoJSON.Point, properties: any };
  clusterComponent: any;
  earthquakes: object;
  clusterLayers: Layer[];

  async ngOnInit() {
    // @ts-ignore
    this.earthquakes = await import('./earthquakes.json');
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

  mapStyleChanged($event: MatSlideToggleChange) {
    if ($event.checked) {
      this.mapStyle = "mapbox://styles/mapbox/dark-v9";
      this.dark = true;
    } else {
      this.mapStyle = "mapbox://styles/mapbox/streets-v9";
      this.dark = false;
    }
  }

  selectCluster(event: MouseEvent, feature: any) {
    event.stopPropagation(); // This is needed, otherwise the popup will close immediately
    // Change the ref, to trigger mgl-popup onChanges (when the user click on the same cluster)
    this.selectedCluster = {geometry: feature.geometry, properties: feature.properties};
  }
}

