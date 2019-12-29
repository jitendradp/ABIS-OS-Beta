import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataspaceComponent } from './dataspace.component';

describe('DataspaceComponent', () => {
  let component: DataspaceComponent;
  let fixture: ComponentFixture<DataspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
