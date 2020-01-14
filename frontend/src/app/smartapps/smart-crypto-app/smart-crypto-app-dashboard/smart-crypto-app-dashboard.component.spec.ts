import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartCryptoAppDashboardComponent } from './smart-crypto-app-dashboard.component';

describe('SmartCryptoAppDashboardComponent', () => {
  let component: SmartCryptoAppDashboardComponent;
  let fixture: ComponentFixture<SmartCryptoAppDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartCryptoAppDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartCryptoAppDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
