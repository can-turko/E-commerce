import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartBillComponent } from './cart-bill.component';

describe('CartBillComponent', () => {
  let component: CartBillComponent;
  let fixture: ComponentFixture<CartBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartBillComponent]
    });
    fixture = TestBed.createComponent(CartBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
