import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTeamComponent } from './editor-team.component';

describe('TeamEditorComponent', () => {
  let component: EditorTeamComponent;
  let fixture: ComponentFixture<EditorTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
