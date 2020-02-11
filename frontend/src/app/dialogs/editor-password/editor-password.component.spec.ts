import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPasswordComponent } from './editor-password.component';

describe('EditorPasswordComponent', () => {
  let component: EditorPasswordComponent;
  let fixture: ComponentFixture<EditorPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
