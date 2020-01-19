import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorRoomComponent } from './editor-room.component';

describe('TeamEditorComponent', () => {
  let component: EditorRoomComponent;
  let fixture: ComponentFixture<EditorRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
