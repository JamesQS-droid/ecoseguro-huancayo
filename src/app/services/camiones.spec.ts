import { TestBed } from '@angular/core/testing';

import { Camiones } from './camiones';

describe('Camiones', () => {
  let service: Camiones;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Camiones);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
