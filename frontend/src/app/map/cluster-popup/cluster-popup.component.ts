import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {GeoJSONSourceComponent} from "ngx-mapbox-gl";
import {MatPaginator, PageEvent} from "@angular/material";

@Component({
  selector: 'showcase-cluster-popup',
  templateUrl: './cluster-popup.component.html',
  styleUrls: ['./cluster-popup.component.css']
})
export class ClusterPopupComponent implements OnChanges {

  @Input() selectedCluster: { geometry: GeoJSON.Point, properties: any };
  @Input() clusterComponent: GeoJSONSourceComponent;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  leaves: GeoJSON.Feature<GeoJSON.Geometry>[];

  ngOnChanges(changes: SimpleChanges) {
    this.changePage();
    if (changes.selectedCluster && !changes.selectedCluster.isFirstChange()) {
      this.paginator.firstPage();
    }
  }

  async changePage(pageEvent?: PageEvent) {
    let offset = 0;
    if (pageEvent) {
      offset = pageEvent.pageIndex * 5;
    }
    this.leaves = await this.clusterComponent.getClusterLeaves(this.selectedCluster.properties!.cluster_id, 5, offset);
  }
}
