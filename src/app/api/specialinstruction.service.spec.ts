import { TestBed } from '@angular/core/testing';

import { SpecialinstructionService } from './specialinstruction.service';

describe('SpecialinstructionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpecialinstructionService = TestBed.get(SpecialinstructionService);
    expect(service).toBeTruthy();
  });
});
