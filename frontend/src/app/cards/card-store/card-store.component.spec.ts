import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardStoreComponent } from './card-store.component';

describe('CardStoreComponent', () => {
  let component: CardStoreComponent;
  let fixture: ComponentFixture<CardStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
