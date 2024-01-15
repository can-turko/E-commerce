import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  product! : Product;

  constructor(private productService:ProductService,
              private route:ActivatedRoute,
              private cartService: CartService){
  }
  
  ngOnInit(){
    this.route.paramMap.subscribe(() =>this.getProduct());
  }
  getProduct() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(id).subscribe(
      result => {this.product=result;}
    )
  }
  addCart(theProduct:Product){
    const cart = new CartItem(theProduct);
    this.cartService.addCart(cart);
  }
}