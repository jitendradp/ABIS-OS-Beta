import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorGroupComponent } from './editor-group.component';

describe('TeamEditorComponent', () => {
  let component: EditorGroupComponent;
  let fixture: ComponentFixture<EditorGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
