import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRefactorComponent } from './chat-refactor.component';

describe('ChatRefactorComponent', () => {
  let component: ChatRefactorComponent;
  let fixture: ComponentFixture<ChatRefactorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatRefactorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRefactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
