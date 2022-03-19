import { TestBed } from '@angular/core/testing';

import { MusiqueService } from './musique.service';

describe('MusiqueService', () => {
  let service: MusiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
