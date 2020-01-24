import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedNotificationComponent } from './feed-notification.component';

describe('FeedNotificationComponent', () => {
  let component: FeedNotificationComponent;
  let fixture: ComponentFixture<FeedNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
