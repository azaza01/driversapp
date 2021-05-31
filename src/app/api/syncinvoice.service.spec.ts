import { TestBed } from '@angular/core/testing';

import { SyncinvoiceService } from './syncinvoice.service';

describe('SyncinvoiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SyncinvoiceService = TestBed.get(SyncinvoiceService);
    expect(service).toBeTruthy();
  });
});
