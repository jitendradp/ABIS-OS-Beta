import {Component} from '@angular/core';
import {MatBottomSheet} from "@angular/material";
import {SearchComponent} from "../../widgets/search/search.component";

@Component({
  selector: 'app-iconbar',
  templateUrl: './iconbar.component.html',
  styleUrls: ['./iconbar.component.css']
})
export class IconbarComponent {

  constructor(private bottomSheet: MatBottomSheet) {
  }

  openBottomSheet() {
  this.bottomSheet.open(SearchComponent)
  }

}
