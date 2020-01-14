import {Component} from "@angular/core";


// Find more properties for the ag-grid here: https://www.ag-grid.com/javascript-grid-column-properties/

@Component({
  selector: 'app-chart-table',
  templateUrl: './chart-table.component.html',
  styleUrls: ['./chart-table.component.css']
})
export class ChartTableComponent {
  columnDefs = [
    {headerName: 'Coin', field: 'coin', sortable: true, filter: true},
    {headerName: 'Holdings', field: 'holdings', sortable: true, filter: false},
    {headerName: 'Price', field: 'price', sortable: true, filter: false},
  ];

  rowData = [
    {coin: 'BTC', holdings: 83.343, price: 19.23},
    {coin: 'ETH', holdings: 793.34, price: 23.34},
    {coin: 'LTC', holdings: 893.34, price: 93.43},
    {coin: 'BTC', holdings: 83.343, price: 19.23},
    {coin: 'ETH', holdings: 793.34, price: 23.34},
    {coin: 'LTC', holdings: 893.34, price: 93.43},
    {coin: 'BTC', holdings: 83.343, price: 19.23},
    {coin: 'ETH', holdings: 793.34, price: 23.34},
    {coin: 'LTC', holdings: 893.34, price: 93.43},
    {coin: 'BTC', holdings: 83.343, price: 19.23},
    {coin: 'ETH', holdings: 793.34, price: 23.34},
    {coin: 'LTC', holdings: 893.34, price: 93.43},
    {coin: 'BTC', holdings: 83.343, price: 19.23},
    {coin: 'ETH', holdings: 793.34, price: 23.34},
    {coin: 'LTC', holdings: 893.34, price: 93.43},
    {coin: 'BTC', holdings: 83.343, price: 19.23},
    {coin: 'ETH', holdings: 793.34, price: 23.34},
    {coin: 'LTC', holdings: 893.34, price: 93.43},
    {coin: 'BTC', holdings: 83.343, price: 19.23},
    {coin: 'ETH', holdings: 793.34, price: 23.34},
    {coin: 'LTC', holdings: 893.34, price: 93.43},
    {coin: 'BTC', holdings: 83.343, price: 19.23},
    {coin: 'ETH', holdings: 793.34, price: 23.34},
    {coin: 'LTC', holdings: 893.34, price: 93.43},
    {coin: 'BTC', holdings: 83.343, price: 19.23},
    {coin: 'ETH', holdings: 793.34, price: 23.34},
    {coin: 'LTC', holdings: 893.34, price: 93.43},
    {coin: 'BTC', holdings: 83.343, price: 19.23},
    {coin: 'ETH', holdings: 793.34, price: 23.34},
    {coin: 'LTC', holdings: 893.34, price: 93.43},
  ];

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

}
