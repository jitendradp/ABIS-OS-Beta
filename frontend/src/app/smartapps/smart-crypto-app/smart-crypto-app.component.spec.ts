import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartCryptoAppComponent } from './smart-crypto-app.component';

describe('SmartCryptoAppComponent', () => {
  let component: SmartCryptoAppComponent;
  let fixture: ComponentFixture<SmartCryptoAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartCryptoAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartCryptoAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
