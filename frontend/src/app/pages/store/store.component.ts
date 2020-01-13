import {Component} from '@angular/core';
import {StoreItemService} from "../../services/store-item.service";

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent {

  public storeItem = this.storeItemService.getStoreItemInformation();

  constructor(
    public storeItemService: StoreItemService,
  ) {
  }

}
