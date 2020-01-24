import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDataspaceComponent } from './list-dataspace.component';

describe('ListDataspaceComponent', () => {
  let component: ListDataspaceComponent;
  let fixture: ComponentFixture<ListDataspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDataspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDataspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
