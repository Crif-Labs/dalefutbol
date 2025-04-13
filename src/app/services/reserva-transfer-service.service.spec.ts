import { TestBed } from '@angular/core/testing';

import { ReservaTransferServiceService } from './reserva-transfer-service.service';

describe('ReservaTransferServiceService', () => {
  let service: ReservaTransferServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservaTransferServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
