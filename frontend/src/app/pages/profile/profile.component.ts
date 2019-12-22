import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @Input()
  picture: string = 'http://i.imgur.com/74sByqd.jpg';

  @Input()
  cover: string = 'https://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero-00e10b1f.jpg';

  @Input()
  name: string = 'David Chang';

  @Input()
  slogan: string = 'To be or not to be, this is my awesome motto!';

  constructor() {
  }

  ngOnInit() {
  }

}
