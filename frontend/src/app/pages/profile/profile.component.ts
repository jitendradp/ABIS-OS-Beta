import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @Input()
  picture: string = '';

  @Input()
  name: string = 'David Chang';

  @Input()
  slogan: string = 'CEO and Founder of ABIS';

  constructor() {
  }

  ngOnInit() {
  }

}
