import { TestBed } from '@angular/core/testing';

import { GroupService } from '../group.service';

describe('TeamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupService = TestBed.get(GroupService);
    expect(service).toBeTruthy();
  });
});
