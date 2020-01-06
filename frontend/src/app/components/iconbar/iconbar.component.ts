import {Component, Input} from '@angular/core';
import {MatBottomSheet} from "@angular/material";
import {SearchComponent} from "../../widgets/search/search.component";

export interface IconList {
  name: string;
  metric?: string;
  label?: string;
  action?: string;
  color?: string;
}

@Component({
  selector: 'app-iconbar',
  templateUrl: './iconbar.component.html',
  styleUrls: ['./iconbar.component.css']
})
export class IconbarComponent {

  @Input()
  onCockpit: boolean;

  @Input()
  onFooter: boolean;

  icons: IconList [] = [
    {
      metric: 'Margin',
      name: 'trending_down',
      label: '-23% | -3.579 Euro',
      action: '',
      color: '#f44336',
    },
    {
      metric: 'Revenue',
      name: 'trending_up',
      label: '+483% | +306.736 Euro',
      action: '',
      color: '#2ecc71',
    },
    {
      metric: 'Costs',
      name: 'trending_flat',
      label: '+0,1% | +73 Euro',
      action: '',
      color: '#204AAB',
    }
  ];

  constructor(private bottomSheet: MatBottomSheet) {
  }

  openBottomSheet() {
    this.bottomSheet.open(SearchComponent)
  }

}
