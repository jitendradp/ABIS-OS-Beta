import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-goback',
  templateUrl: './goback.component.html',
  styleUrls: ['./goback.component.css']
})
export class GobackComponent implements OnInit {

  @Input ()
  showIcon: boolean;

  @Input ()
  icon: string;

  @Input ()
  title: string;

  constructor() { }

  ngOnInit() {
  }

}
