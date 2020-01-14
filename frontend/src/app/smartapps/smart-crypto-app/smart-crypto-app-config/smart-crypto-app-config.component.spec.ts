import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartCryptoAppConfigComponent } from './smart-crypto-app-config.component';

describe('SmartCryptoAppConfigComponent', () => {
  let component: SmartCryptoAppConfigComponent;
  let fixture: ComponentFixture<SmartCryptoAppConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartCryptoAppConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartCryptoAppConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
