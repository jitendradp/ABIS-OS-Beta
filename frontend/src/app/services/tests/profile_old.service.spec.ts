import { TestBed } from '@angular/core/testing';

import { Profile_oldService } from '../profile_old.service';

describe('ProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Profile_oldService = TestBed.get(Profile_oldService);
    expect(service).toBeTruthy();
  });
});
