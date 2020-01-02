import { TestBed } from '@angular/core/testing';

import { DataspaceService } from '../dataspace.service';

describe('WorkspaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataspaceService = TestBed.get(DataspaceService);
    expect(service).toBeTruthy();
  });
});
