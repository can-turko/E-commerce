import { Component } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent {
  totalQuantity:number=0;
  totalPrice:number=0.00;
  cartItems:CartItem[]=[];

  constructor(private cartService:CartService){}

  ngOnInit(){
    this.updateValues();
  }
  updateValues() {
    this.cartItems=this.cartService.cartItems;
    
    this.cartService.totalPrice.subscribe(
      result =>{
        this.totalPrice=result
      }
    )

    this.cartService.totalQuantity.subscribe(
      result =>{
        this.totalQuantity=result
      }
    )
    this.cartService.computeCartTotals();
  }
  incriaseItem(cart:CartItem){
    this.cartService.addCart(cart);
  }
  decreaseItem(cart:CartItem){
    cart.quantity--;
    if(cart.quantity==0){
      this.cartService.removeItem(cart);
    }
  }
  remove(cart:CartItem){
    this.cartService.removeItem(cart);
  }
}
