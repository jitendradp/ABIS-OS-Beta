import {Component} from "@angular/core";

@Component({
  selector: 'app-chart-table',
  templateUrl: './chart-table.component.html',
  styleUrls: ['./chart-table.component.css']
})
export class ChartTableComponent {
  columnDefs = [
    {headerName: 'Coin', field: 'coin', sortable: true, filter: true, width: 100},
    {headerName: 'Holdings', field: 'holdings', sortable: true, filter: true, width: 100},
    {headerName: 'Price', field: 'price', sortable: true, filter: true, width: 100},
  ];

  rowData = [
    {coin: 'BTC', holdings: 83.343, price: 19.23},
    {coin: 'ETH', holdings: 793.34, price: 23.34},
    {coin: 'LTC', holdings: 893.34, price: 93.43}
  ];

}


