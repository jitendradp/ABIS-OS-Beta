import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatSlideToggleChange} from "@angular/material";
import {FindRoomsGQL, GetEntriesGQL} from "../../../generated/abis-api";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {

  mapStyle = "mapbox://styles/mapbox/streets-v9";
  dark: boolean = false;

  geoJsonEntries: any[] = [];

  datenDieterId:string;

  @Input()
  public groupId:string[] = [];
  colorPalette: string[] = [
     "#77aaff"
    ,"#99ccff"
    ,"#bbeeff"
    ,"#5588ff"
    ,"#3366ff"];

  constructor(private getEntries: GetEntriesGQL
              ,private findRooms: FindRoomsGQL
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

    const rooms = (await this.findRooms.fetch({csrfToken: this.userService.csrfToken, searchText:""}).toPromise()).data.findRooms;


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

  mapStyleChanged($event: MatSlideToggleChange) {
    if ($event.checked) {
      this.mapStyle = "mapbox://styles/mapbox/dark-v9";
      this.dark = true;
    } else {
      this.mapStyle = "mapbox://styles/mapbox/streets-v9";
      this.dark = false;
    }
  }
}
