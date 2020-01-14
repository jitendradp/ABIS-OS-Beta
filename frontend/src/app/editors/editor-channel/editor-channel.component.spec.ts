import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorChannelComponent } from './editor-channel.component';

describe('ChannelEditorComponent', () => {
  let component: EditorChannelComponent;
  let fixture: ComponentFixture<EditorChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
