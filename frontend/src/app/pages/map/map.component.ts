import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Entry, FindRoomsGQL, GetEntriesGQL} from "../../../generated/abis-api";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {

  mapStyle = "mapbox://styles/mapbox/dark-v9";
  // mapStyle = "mapbox://styles/mapbox/streets-v9";

  geoJsonEntries: any[] = [];
  datenDieterId: string;

  @Input()
  public groupId: string[] = [];
  colorPalette: string[] = [
    "#77aaff"
    , "#99ccff"
    , "#bbeeff"
    , "#5588ff"
    , "#3366ff"];

  constructor(private getEntries: GetEntriesGQL
    , private findRooms: FindRoomsGQL
    , private userService: UserService) {
    this.datenDieterId = this.userService.systemServices.find(o => o.name == "DatenDieter").id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["groupId"]) {
      return;
    }
    if (!this.groupId) {
      throw new Error("The groupId property must be set to a value.")
    }
    this.initMap();
  }

  async ngOnInit() {
    if (!this.groupId) {
      return;
    }
    this.initMap();
  }

  async initMap() {
    const rooms = (await this.findRooms.fetch({
      csrfToken: this.userService.csrfToken,
      searchText: ""
    }).toPromise()).data.findRooms;

    this.geoJsonEntries = [];
    rooms.map(o => o.id).forEach(async groupId => {
      const groupEntries = (await this.getEntries.fetch({
        groupId: groupId,
        csrfToken: this.userService.csrfToken
        // TODO: Add "type" filter
      }).toPromise()).data.getEntries;

      groupEntries.forEach(entry => {
        this.geoJsonEntries.push(entry);
      });
    });
  }

  layerMouseMove($event: mapboxgl.MapLayerMouseEvent, entry: Entry) {
    if (this.hoveredEntry != entry) {
      this.hoveredEntry = entry;
    }
  }

  layerMouseEnter($event: mapboxgl.MapLayerMouseEvent, entry: Entry) {
  }

  layerMouseLeave($event: mapboxgl.MapLayerMouseEvent, entry: Entry) {
    this.hoveredEntry = null;
  }

  layerMouseClick($event: mapboxgl.MapLayerMouseEvent, entry: Entry) {
    // this.selectedEntry = entry;
  }

  mapClick($event: mapboxgl.MapMouseEvent) {
    if (!$event.target.queryRenderedFeatures) {
      this.selectedEntry = null;
      return;
    }
    var features = $event.target.queryRenderedFeatures($event.point);
    if (features.length == 0) {
      this.selectedEntry = null;
      return;
    }
  }

  hoveredEntry:Entry;
  selectedEntry:Entry;

  getPaint(entry: Entry) {
    if (this.hoveredEntry == entry || this.selectedEntry == entry) {
      return {
        'fill-color': "#f00",
        'fill-opacity': 0.4
      };
    } else {
      return {
        'fill-color': this.colorPalette[Math.abs(this.getHashFromString(entry.id) % this.colorPalette.length)],
        'fill-opacity': 0.4
      };
    }
  }

  getHashFromString(str:string) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
}
