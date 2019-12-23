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

  @Input()
  name: string;

  @Input()
  slogan: string;

  constructor() { }

  ngOnInit() {
  }

}
