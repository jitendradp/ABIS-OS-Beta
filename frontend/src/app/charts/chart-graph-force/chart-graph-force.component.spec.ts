import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartGraphForceComponent } from './chart-graph-force.component';

describe('ChartGraphForceComponent', () => {
  let component: ChartGraphForceComponent;
  let fixture: ComponentFixture<ChartGraphForceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartGraphForceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartGraphForceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
