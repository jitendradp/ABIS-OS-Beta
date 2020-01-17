import {Component} from "@angular/core";


// Find more properties for the ag-grid here: https://www.ag-grid.com/javascript-grid-column-properties/
// todo add cell conditional style on numeric fields: https://www.ag-grid.com/javascript-grid-cell-styles/
// todo add second child row to cell to indicate the change over the day

@Component({
  selector: 'app-chart-table',
  templateUrl: './chart-table.component.html',
  styleUrls: ['./chart-table.component.css']
})
export class ChartTableComponent {
  columnDefs = [
    {headerName: 'Coin', field: 'coin', sortable: true, filter: true,},
    {headerName: 'Exchange', field: 'exchange', sortable: true, filter: true},
    {headerName: 'Holdings', field: 'holdings', sortable: true, filter: false},
    {headerName: 'Price', field: 'price', sortable: true, filter: false},
  ];

  rowData = [
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
    {coin: 'BTC', exchange: 'Kraken', holdings: 83.343, price: 19.23},
    {coin: 'ETH', exchange: 'Bitfinex', holdings: 793.34, price: 23.34},
    {coin: 'LTC', exchange: 'SIK', holdings: 893.34, price: 93.43},
  ];

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

}
