import {Component, Input, OnInit} from '@angular/core';
import {EChartOption} from 'echarts';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {parse} from 'echarts/extension/dataTool/gexf';

@Component({
  selector: 'app-chart-graph-force',
  templateUrl: './chart-graph-force.component.html',
  styleUrls: ['./chart-graph-force.component.css']
})
export class ChartGraphForceComponent implements OnInit {

  @Input()
  chartHeight: string;

  options: Observable<EChartOption>;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.options = this.http.get('assets/data/les-miserables.gexf', {responseType: 'text'}).pipe(
      map(xml => {
        const graph = parse(xml);
        const categories = [];
        for (let i = 0; i < 9; i++) {
          categories[i] = {
            name: 'Network' + i
          };
        }
        graph.nodes.forEach(function (node) {
          node.itemStyle = null;
          node.symbolSize = 10;
          node.value = node.symbolSize;
          node.category = node.attributes.modularity_class;
          // Use random x, y
          node.x = node.y = null;
          node.draggable = true;
        });
        return {
          tooltip: {},
          legend: [{
            data: categories.map(function (a) {
              return a.name;
            })
          }] as EChartOption.Legend,
          animation: false,
          series: [
            {
              name: 'Social Media Network',
              type: 'graph',
              layout: 'force',
              data: graph.nodes,
              links: graph.links,
              categories: categories,
              roam: true,
              label: {
                normal: {
                  position: 'right'
                }
              },
              force: {
                repulsion: 100
              }
            }
          ]
        };
      })
    );
  }

}
