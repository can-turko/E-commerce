import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, from, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(@Inject(OKTA_AUTH) private oktaAuth:OktaAuth) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req,next));
  }

  async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    //Only add an access token for secured endpoints
    const endpoints=environment.myBackendUrl+"/orders";
    const securedEnpoinds=[endpoints];
    
    if(securedEnpoinds.some(url => req.urlWithParams.includes(url))){

      //get access token
      const accessToken = this.oktaAuth.getAccessToken();

      // clone the request and add new header with access token
      req = req.clone({
        setHeaders:{
          Authorization:'Bearer '+accessToken
        }
      });
    }
    return await lastValueFrom(next.handle(req))
  }
}
