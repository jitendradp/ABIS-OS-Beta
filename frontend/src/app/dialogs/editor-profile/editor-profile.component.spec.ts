import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorProfileComponent } from './editor-profile.component';

describe('EditorProfileComponent', () => {
  let component: EditorProfileComponent;
  let fixture: ComponentFixture<EditorProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
