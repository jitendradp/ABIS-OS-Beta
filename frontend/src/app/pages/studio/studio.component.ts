import {Component} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-studio',
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.css']
})
export class StudioComponent {

  availableMetrics = [
    'Conversions',
    'Sessions',
    'Revenues',
    'Users',
    'Bounces',
    'Durations',
    'Likes'
  ];

  yourDataset = [
    'Costs',
    'Channel',
    'Linkedin Page',
    'Abortions',
  ];

  availableDimensions = [
    'Website',
    'Landingpage',
    'Facebook Page',
    'Campaign',
  ];

  yourDimensions = [
    'Device',
    'Posting',
    'Channel',
    'Product',
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
