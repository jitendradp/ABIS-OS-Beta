import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedThreadComponent } from './feed-thread.component';

describe('FeedThreadComponent', () => {
  let component: FeedThreadComponent;
  let fixture: ComponentFixture<FeedThreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedThreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
