import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  theBaseUrl=environment.myBackendUrl+'/orders';

  constructor(protected httpClient:HttpClient) { }

  getOrderHistory(email:string):Observable<GetOrders>{
    let theUrl =`${this.theBaseUrl}/search/findByCustomerEmail?email=${email}`
    return this.httpClient.get<GetOrders>(theUrl)
  }
}
interface GetOrders{
  _embedded:{
    orders:OrderHistory[]
  }
}
