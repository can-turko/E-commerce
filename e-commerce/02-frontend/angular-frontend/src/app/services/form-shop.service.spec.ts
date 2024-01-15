import { TestBed } from '@angular/core/testing';

import { FormShopService } from './form-shop.service';

describe('FormShopService', () => {
  let service: FormShopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormShopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
