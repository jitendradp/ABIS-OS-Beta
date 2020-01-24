import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNavigationComponent } from './chat-navigation.component';

describe('ChatNavigationComponent', () => {
  let component: ChatNavigationComponent;
  let fixture: ComponentFixture<ChatNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
