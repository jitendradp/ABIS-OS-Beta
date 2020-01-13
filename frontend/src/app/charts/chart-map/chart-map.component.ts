import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart-map',
  templateUrl: './chart-map.component.html',
  styleUrls: ['./chart-map.component.css']
})
export class ChartMapComponent implements OnInit {

  @Input()
  chartHeight: string;

  // show loading spinner:
  mapLoaded = false;
  // empty option before geoJSON loaded:
  options = {};

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    // fetch map geo JSON data from server
    this.http.get('assets/data/HK.json')
      .subscribe(geoJson => {
        // hide loading:
        this.mapLoaded = true;
        // register map:
        echarts.registerMap('HK', geoJson);
        // update options:
        this.options = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>{c} (p / km2)'
          },
          toolbox: {
            show: false,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },
          visualMap: {
            min: 800,
            max: 50000,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            inRange: {
              color: ['lightskyblue', 'yellow', 'orangered']
            }
          },
          series: [
            {
              name: 'China',
              type: 'map',
              mapType: 'HK', // map type should be registered
              itemStyle: {
                normal: {label: {show: true}},
                emphasis: {label: {show: true}}
              },
              data: [
                {name: '80339', value: 20057.34},
                {name: '83957', value: 15477.48},
                {name: '27596', value: 31686.1},
                {name: '95454', value: 6992.6},
                {name: '27436', value: 44045.49},
                {name: '46632', value: 40689.64},
                {name: '23245', value: 37659.78},
                {name: '74733', value: 45180.97},
                {name: '86834', value: 55204.26},
                {name: '34467', value: 21900.9},
                {name: '96745', value: 4918.26},
                {name: '85723', value: 5881.84},
                {name: '30743', value: 4178.01},
                {name: '17483', value: 2227.92},
                {name: '75034', value: 2180.98},
                {name: '54745', value: 9172.94},
                {name: '62545', value: 3368},
                {name: '64234', value: 806.98}
              ],
              nameMap: {
                'Central and Western': '80339',
                'Eastern': '83957',
                'Islands': '27596',
                'Kowloon City': '95454',
                'Kwai Tsing': '27436',
                'Kwun Tong': '46632',
                'North': '23245',
                'Sai Kung': '74733',
                'Sha Tin': '86834',
                'Sham Shui Po': '34467',
                'Southern': '96745',
                'Tai Po': '85723',
                'Tsuen Wan': '30743',
                'Tuen Mun': '17483',
                'Wan Chai': '75034',
                'Wong Tai Sin': '54745',
                'Yau Tsim Mong': '62545',
                'Yuen Long': '64234'
              }
            }
          ]
        };
      });
  }
}
