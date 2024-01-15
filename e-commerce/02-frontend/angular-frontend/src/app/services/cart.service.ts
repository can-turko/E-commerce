import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems:CartItem[]=[];

  totalPrice:Subject<number>=new BehaviorSubject<number>(0);
  totalQuantity:Subject<number>=new BehaviorSubject<number>(0);

  //storage:Storage=localStorage;
  storage:Storage=sessionStorage;


  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    if(data !=null){
      this.cartItems=data;
      this.computeCartTotals();
    }
   }

  addCart(theCart:CartItem){
    let hasExistingCart: boolean= false;
    let existingCartItem: CartItem = undefined!;

    //lets check if theCart is already existed

    existingCartItem = this.cartItems.find(sCart => sCart.id===theCart.id)!;

    hasExistingCart=existingCartItem != undefined;
    if(hasExistingCart){
      existingCartItem.quantity++;
    }
    else{
      this.cartItems.push(theCart);
    }
    this.computeCartTotals();
  }

  persistCartItem(){
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
  }


  computeCartTotals() {
    let totalPriceSum:number=0;
    let totalQuantitySum:number=0;
    for(let cCart of this.cartItems){
      totalPriceSum += (cCart.quantity*cCart.unitPrice);
      totalQuantitySum += cCart.quantity;
    }
    this.totalPrice.next(totalPriceSum);
    this.totalQuantity.next(totalQuantitySum);

    this.persistCartItem();
  }

  removeItem(cart: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempItem => tempItem.id===cart.id);

    if(itemIndex>-1){
      this.cartItems.splice(itemIndex,1)
      this.computeCartTotals();
    }

  }
}
