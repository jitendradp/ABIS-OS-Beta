import {Component, Input} from '@angular/core';


export interface roomItem {
  name: string;
  title: string;
  creator: string;
  createdAt: string;
  pictureLogo: string;
  description: string;
  membersLive: number;
  membersTotal: number;
  location: string;
  buttonLink: string;
  tags: string;
}

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent {

  @Input()
  collapsed: boolean;

  @Input()
  showSearch: boolean = true;

  rooms: roomItem [] = [
    {
      name: 'tum',
      title: 'TU München',
      tags: '#uni, #abis',
      buttonLink: 'chat',
      location: 'Dieselstr. 22b in 85551 Kirchheim (DE)',
      membersLive: 39,
      membersTotal: 89,
      creator: 'Mr. Monkey',
      createdAt: 'Friday, 2020-01-01 9:15 AM',
      pictureLogo: 'https://picsum.photos/200',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      name: 'bcg',
      title: 'Boston Group',
      tags: '#uni, #abis',
      buttonLink: 'chat',
      location: 'Dieselstr. 22b in 85551 Kirchheim (DE)',
      membersLive: 39,
      membersTotal: 89,
      creator: 'Simon Says',
      createdAt: 'Friday, 2020-01-01 9:15 AM',
      pictureLogo: 'https://source.unsplash.com/random',
      description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',
    },
    {
      name: 'fhm',
      title: 'Hochschule München',
      tags: '#uni, #abis',
      buttonLink: 'chat',
      location: 'Dieselstr. 22b in 85551 Kirchheim (DE)',
      membersLive: 39,
      membersTotal: 89,
      creator: 'Mr. Monkey',
      createdAt: 'Friday, 2020-01-01 9:15 AM',
      pictureLogo: 'https://loremflickr.com/320/240',
      description: 'The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.',
    },
    {
      name: 'hit',
      title: 'HIT Einkaufsladen',
      tags: '#uni, #abis',
      buttonLink: 'chat',
      location: 'Dieselstr. 22b in 85551 Kirchheim (DE)',
      membersLive: 39,
      membersTotal: 89,
      creator: 'Joe Mo',
      createdAt: 'Friday, 2020-01-01 9:15 AM',
      pictureLogo: 'http://www.funcage.com/photos/1156765521_28_podborka_35.jpg',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      name: 'fhm',
      title: 'Hochschule München',
      tags: '#uni, #abis',
      buttonLink: 'chat',
      location: 'Dieselstr. 22b in 85551 Kirchheim (DE)',
      membersLive: 39,
      membersTotal: 89,
      creator: 'Mr. Monkey',
      createdAt: 'Friday, 2020-01-01 9:15 AM',
      pictureLogo: 'https://loremflickr.com/320/240',
      description: 'The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.',
    },
    {
      name: 'hit',
      title: 'HIT Einkaufsladen',
      tags: '#uni, #abis',
      buttonLink: 'chat',
      location: 'Dieselstr. 22b in 85551 Kirchheim (DE)',
      membersLive: 39,
      membersTotal: 89,
      creator: 'Joe Mo',
      createdAt: 'Friday, 2020-01-01 9:15 AM',
      pictureLogo: 'http://www.funcage.com/photos/1156765521_28_podborka_35.jpg',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
  ];

}
