import {IEvent} from "../IEvent";

export class RouteChanged implements IEvent {
  public static readonly Name: string = "Abis.Routes.RouteChanged";
  name: string = RouteChanged.Name;
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}
