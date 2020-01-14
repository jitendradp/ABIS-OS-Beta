import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPortfolioComponent } from './card-portfolio.component';

describe('CardPortfolioComponent', () => {
  let component: CardPortfolioComponent;
  let fixture: ComponentFixture<CardPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
