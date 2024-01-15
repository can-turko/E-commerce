import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent {

  totalPrice=0.00;
  totalQuantity=0;

  constructor(private cartService:CartService){}

  ngOnInit(){
    this.updateValues();
  }
  updateValues() {
    this.cartService.totalPrice.subscribe(
      data =>{
        this.totalPrice=data
      }
    )
    this.cartService.totalQuantity.subscribe(
      data=>{
        this.totalQuantity=data
      }
    )
  }
}
