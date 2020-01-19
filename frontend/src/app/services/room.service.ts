import {Injectable} from '@angular/core';

export type RoomInformation = {
  name: string,
  title: string,
  description: string,
  logo: string,
  is_hidden: boolean,
  is_public: boolean,
  createdAt: string,
  host: string,
  tags: string,
  members_count: number,
  members_online: number,
  messages_count: number,
};

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  public roomInformation: RoomInformation = {
    "host": "lilia",
    "createdAt": "2019-09-21",
    "name": "tum",
    "title": "TU München",
    "description": "Die Technische Universität München ist die einzige Technische Universität in Bayern. Sie ist mit über 41.000 Studenten die zweitgrößte Technische Hochschule in Deutschland.",
    "logo": "https://tea-transfer.de/wp-content/uploads/sites/7/2018/03/TUM_Logo_extern_ot_RGB.png",
    "is_hidden": false,
    "is_public": true,
    "tags": "#university #munich #public",
    "members_count": 34456,
    "members_online": 82,
    "messages_count": 8992,
  }
}
