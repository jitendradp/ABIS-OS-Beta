import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartCryptoAppSetupComponent } from './smart-crypto-app-setup.component';

describe('SmartCryptoAppSetupComponent', () => {
  let component: SmartCryptoAppSetupComponent;
  let fixture: ComponentFixture<SmartCryptoAppSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartCryptoAppSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartCryptoAppSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
