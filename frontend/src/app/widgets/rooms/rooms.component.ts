import {Component} from '@angular/core';

export interface roomItem {
  creator: string;
  creationDate: string;
  pictureCreator: string;
  picturePost: string;
  message: string;
}

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {

  items: roomItem [] = [
    {
      creator: 'Mr. Monkey',
      creationDate: '9:15 AM',
      pictureCreator: 'https://www.fillmurray.com/100/100',
      picturePost: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      creator: 'Simon Says',
      creationDate: '9:15 AM',
      pictureCreator: 'https://www.fillmurray.com/50/50',
      picturePost: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&w=1000&q=80',
      message: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',
    },
    {
      creator: 'Mr. Monkey',
      creationDate: '9:15 AM',
      pictureCreator: 'https://www.fillmurray.com/150/150',
      picturePost: 'https://www.welt.de/img/wirtschaft/mobile186141296/3622504457-ci102l-w1024/Hong-Kong-skyline-from-The-peak-view-point.jpg',
      message: 'The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.',
    },
    {
      creator: 'Joe Mo',
      creationDate: '9:15 AM',
      pictureCreator: 'https://www.fillmurray.com/100/100',
      picturePost: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzzx-YCccfzF9XuFE-s0V1ZA1z1nefBenjnYAoMDf1uRORdYtK&s',
      message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
  ];

}
