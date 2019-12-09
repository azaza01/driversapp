import { TestBed } from '@angular/core/testing';

import { SyncdeliveryService } from './syncdelivery.service';

describe('SyncdeliveryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SyncdeliveryService = TestBed.get(SyncdeliveryService);
    expect(service).toBeTruthy();
  });
});
