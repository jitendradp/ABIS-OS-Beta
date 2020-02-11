import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPasscodeComponent } from './input-passcode.component';

describe('InputPasscodeComponent', () => {
  let component: InputPasscodeComponent;
  let fixture: ComponentFixture<InputPasscodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputPasscodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputPasscodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
