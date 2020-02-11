import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorAccountComponent } from './editor-account.component';

describe('EditorAccountComponent', () => {
  let component: EditorAccountComponent;
  let fixture: ComponentFixture<EditorAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
