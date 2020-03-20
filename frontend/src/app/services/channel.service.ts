import {Injectable} from '@angular/core';
import {
  GetEntriesGQL,
  MyChannelsGQL,
  NewChannelGQL,
  NewEntryGQL
} from "../../generated/abis-api";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  private channels:[];

  constructor(
      private userService: UserService
    , private myChannelsApi: MyChannelsGQL
    , private newChannelSubscription: NewChannelGQL
    , private newEntrySubscription: NewEntryGQL
    , private getEntries: GetEntriesGQL) {

    // 1. Check if there is a valid session
    // 2. Check if its an authenticated session
    //


  }


  createChannel(toAgentId:string, waitForReverseChannel:boolean, waitTimeout:number) {
  }
}

