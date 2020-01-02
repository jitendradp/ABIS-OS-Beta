import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Chat_oldComponent } from './chat_old.component';

describe('ChatComponent', () => {
  let component: Chat_oldComponent;
  let fixture: ComponentFixture<Chat_oldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Chat_oldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Chat_oldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
