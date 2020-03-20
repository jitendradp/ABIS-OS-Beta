import {GetSystemServicesGQL} from "../../generated/abis-api";
import {Subject} from "rxjs";
import {ActionDispatcherService} from "./action-dispatcher.service";

export type SystemService = {id:string, name:string};

export class SystemAgentsService {
  public agents = new Subject<SystemService>();

  constructor(private actionDispatcher: ActionDispatcherService,
              private getSystemServicesApi: GetSystemServicesGQL) {
  }
}
