import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChipComponent } from './list-chip.component';

describe('ChipListComponent', () => {
  let component: ListChipComponent;
  let fixture: ComponentFixture<ListChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
