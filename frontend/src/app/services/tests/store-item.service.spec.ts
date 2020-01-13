import { TestBed } from '@angular/core/testing';

import { StoreItemService } from '../store-item.service';

describe('StoreItemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoreItemService = TestBed.get(StoreItemService);
    expect(service).toBeTruthy();
  });
});
