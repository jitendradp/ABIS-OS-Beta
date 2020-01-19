import {Injectable} from '@angular/core';


export type ChannelInformation = {
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
export class ChannelService {

  public channelInformation: ChannelInformation = {
    "host": "johnnythetank",
    "createdAt": "2019-08-21",
    "name": "chaos",
    "title": "Chaos Channel",
    "description": "Enter the void.",
    "logo": "https://tea-transfer.de/wp-content/uploads/sites/7/2018/03/TUM_Logo_extern_ot_RGB.png",
    "is_hidden": false,
    "is_public": true,
    "tags": "#chaos #work #stuff",
    "members_count": 98,
    "members_online": 4,
    "messages_count": 12,
  }
}

