import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedMessageComponent } from './feed-message.component';

describe('FeedComponent', () => {
  let component: FeedMessageComponent;
  let fixture: ComponentFixture<FeedMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
