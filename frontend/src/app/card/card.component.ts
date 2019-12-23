import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input()
  picture: string;

  @Input ()
  action: string;

  @Input ()
  showOptions: boolean;

  @Input ()
  showContent: boolean;

  @Input ()
  image: string;

  @Input ()
  showImage: boolean;

  @Input ()
  showIcon: boolean;

  @Input ()
  creator: string;

  @Input ()
  creationDate: string;

  @Input ()
  showStats: boolean;

  @Input()
  title: string;

  @Input()
  subtitle: string;

  constructor() { }

  ngOnInit() {
  }

}
