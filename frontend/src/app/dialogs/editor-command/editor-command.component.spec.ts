import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorCommandComponent } from './editor-command.component';

describe('CommandComponent', () => {
  let component: EditorCommandComponent;
  let fixture: ComponentFixture<EditorCommandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorCommandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
