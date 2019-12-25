import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input ()
  status: string;

  @Input ()
  showStatus: boolean;

  @Input()
  action: string;

  @Input()
  showMaxButton: boolean;

  @Input()
  showActionList: boolean;

  @Input()
  showContent: boolean;

  @Input()
  image: string;

  @Input()
  statsIcon: string;

  @Input()
  statsLeft: string;

  @Input()
  statsRight: string;

  @Input()
  icon: string;

  @Input()
  showImage: boolean;

  @Input()
  showIcon: boolean;

  @Input()
  creator: string;

  @Input()
  creationDate: string;

  @Input()
  showStats: boolean;

  @Input()
  title: string;

  @Input()
  subtitle: string;

  constructor() {
  }

  ngOnInit() {
  }

}
