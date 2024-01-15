import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  theBaseUrl= environment.myBackendUrl+"/checkout/purchase";
  theCheckOutUrl=environment.myBackendUrl+"/checkout/payment-intent"

  constructor(private httpClient:HttpClient) { }

  placeOrder(purchase:Purchase):Observable<any>{
    return this.httpClient.post<Purchase>(this.theBaseUrl,purchase);
  }
  placePayment(paymentInfo:PaymentInfo):Observable<any>{
    return this.httpClient.post<PaymentInfo>(this.theCheckOutUrl,paymentInfo);
  }
}

