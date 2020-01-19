import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRoomComponent } from './card-room.component';

describe('CardTeamComponent', () => {
  let component: CardRoomComponent;
  let fixture: ComponentFixture<CardRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
