import { Component } from '@angular/core';
import { Order } from 'src/app/common/order';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {

  orderHistories:OrderHistory[]=[];
  storage:Storage=sessionStorage;

  constructor(private orderHistoryService:OrderHistoryService){}

  ngOnInit():void{
    this.handleOrders();
  }
  handleOrders() {
    let email = JSON.parse(this.storage.getItem('email')!);
    this.orderHistoryService.getOrderHistory(email).subscribe(
      result=>{
        this.orderHistories=result._embedded.orders
      }
    )
  }

}
