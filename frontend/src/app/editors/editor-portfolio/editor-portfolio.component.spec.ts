import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPortfolioComponent } from './editor-portfolio.component';

describe('EditorPortfolioComponent', () => {
  let component: EditorPortfolioComponent;
  let fixture: ComponentFixture<EditorPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
