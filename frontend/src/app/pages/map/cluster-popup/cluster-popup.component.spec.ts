import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterPopupComponent } from './cluster-popup.component';

describe('ClusterPopupComponent', () => {
  let component: ClusterPopupComponent;
  let fixture: ComponentFixture<ClusterPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
