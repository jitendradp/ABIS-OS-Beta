import {AfterViewInit, Component, Input} from '@angular/core';
import {AddTagGQL, Entry} from "../../../generated/abis-api";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {JumpToMapPosition} from "../../actions/ui/JumpToMapPosition";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-geoJson-entry',
  templateUrl: './geoJson-entry.component.html',
  styleUrls: ['./geoJson-entry.component.css']
})
export class GeoJsonEntryComponent implements AfterViewInit{
  mapStyle = "mapbox://styles/mapbox/dark-v9";

  colorPalette: string[] = [
    "#77aaff"
    , "#99ccff"
    , "#bbeeff"
    , "#5588ff"
    , "#3366ff"];

  getPaint(entry: Entry) {
    return {
      'fill-color': this.colorPalette[Math.abs(this.getHashFromString(entry.id) % this.colorPalette.length)],
      'fill-opacity': 0.4
    };
  }

  constructor(private actionDispatcher: ActionDispatcherService
  , private addTagApi:AddTagGQL
  , private userService:UserService) {
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

  ngAfterViewInit(): void {
    this.center = this.entry.content.geometry.coordinates[0][0];
    if (Array.isArray(this.center) && this.center.length > 2) {
      this.center = this.center[0];
    }
  }

  @Input()
  groupId:any;

  @Input()
  entry:any;

  @Input()
  creator: string;

  @Input()
  createdAt: string;

  @Input()
  title: string;

  @Input()
  message: string;

  @Input()
  pictureCreator: string;

  @Input()
  picturePost: string;

  @Input()
  collapsedSplit: boolean;

  @Input()
  commentsCount: number;

  @Input()
  likesCount: number;

  @Input()
  sharesCount: number;

  center: any;

  onMapClick() {
    this.actionDispatcher.dispatch(new JumpToMapPosition(this.center, this.groupId));
  }

  async onThumbsUp() {
    await this.addTagApi.mutate({csrfToken: this.userService.csrfToken, to: this.entry.id, addTagInput: {
      type: "thumbs-up",
        value: "Deine Mudda"
      }}).toPromise();
  }
}
