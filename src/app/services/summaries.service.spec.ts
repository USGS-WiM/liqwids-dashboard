import { TestBed } from '@angular/core/testing';

import { SummariesService } from './summaries.service';

describe('SummariesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SummariesService = TestBed.get(SummariesService);
    expect(service).toBeTruthy();
  });
});
