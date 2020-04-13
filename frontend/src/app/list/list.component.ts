import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input()
  entries: any[] = [];

  showActions: boolean;
  collapsed: boolean;

  constructor() { }

  ngOnInit() {
  }
}
