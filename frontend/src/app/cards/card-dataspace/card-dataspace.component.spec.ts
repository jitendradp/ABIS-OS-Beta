import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDataspaceComponent } from './card-dataspace.component';

describe('CardDataspaceComponent', () => {
  let component: CardDataspaceComponent;
  let fixture: ComponentFixture<CardDataspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDataspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDataspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
