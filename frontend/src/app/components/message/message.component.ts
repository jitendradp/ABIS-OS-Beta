import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  @Input()
  creator: string;

  @Input()
  creationDate: string;

  @Input()
  showStats: boolean;

  @Input()
  title: string;

  @Input()
  subtitle: boolean;

  @Input()
  message: string;

}
