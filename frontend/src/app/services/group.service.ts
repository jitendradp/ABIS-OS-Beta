import {Injectable} from '@angular/core';

export type GroupInformation = {
  name: string,
  title: string,
  description: string,
  pictureLogo: string,
  isHidden: boolean,
  isPublic: boolean,
  createdAt: string,
  creator: string,
  tags: string,
  membersCount: number,
  membersOnline: number,
  eventsCount: number,
};

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  public groupInformation: GroupInformation = {
    "creator": "tomsawyer88",
    "createdAt": "2019-09-21",
    "name": "tum",
    "title": "TU München",
    "description": "Die Technische Universität München ist die einzige Technische Universität in Bayern. Sie ist mit über 41.000 Studenten die zweitgrößte Technische Hochschule in Deutschland.",
    "pictureLogo": "https://tea-transfer.de/wp-content/uploads/sites/7/2018/03/TUM_Logo_extern_ot_RGB.png",
    "isHidden": false,
    "isPublic": true,
    "tags": "#university #munich #public",
    "membersCount": 34456,
    "membersOnline": 82,
    "eventsCount": 8992,
  }
}
