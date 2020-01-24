import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchProfileComponent } from './switch-profile.component';

describe('SwitchProfileComponent', () => {
  let component: SwitchProfileComponent;
  let fixture: ComponentFixture<SwitchProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
