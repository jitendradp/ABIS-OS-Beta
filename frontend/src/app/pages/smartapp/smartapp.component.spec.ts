import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartappComponent } from './smartapp.component';

describe('SmartappComponent', () => {
  let component: SmartappComponent;
  let fixture: ComponentFixture<SmartappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
