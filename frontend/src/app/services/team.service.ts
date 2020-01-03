import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  getTeamInformation() {
    return {
      "name": "TU München",
      "nickname": "@tum",
      "description": "Die Technische Universität München ist die einzige Technische Universität in Bayern. Sie ist mit über 41.000 Studenten die zweitgrößte Technische Hochschule in Deutschland.",
      "tags": "#university #munich #public",
      "address": "Steinbachstr. 82",
      "city": "Munich",
      "country": "Germany",
      "followers": 34456,
      "activeUsers": 82,
      "type": "Public",
      "creator": "@lilia",
      "createdAt": "2019-09-21",
      "logo": "https://tea-transfer.de/wp-content/uploads/sites/7/2018/03/TUM_Logo_extern_ot_RGB.png",
      "isNew": 1
    }
  }
}
