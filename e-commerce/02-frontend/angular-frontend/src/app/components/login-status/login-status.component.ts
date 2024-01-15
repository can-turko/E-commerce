import { Component, Inject } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent {

  isAuthenticated:boolean=false;
  userFullName:string='';
  storage:Storage=sessionStorage;

  constructor(private oktaAuthService:OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth:OktaAuth){}
  
  ngOnInit():void{
    //subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result)=>{
        this.isAuthenticated=result.isAuthenticated!;
        this.getUserDetails();
      }
    )
  }
  getUserDetails() {
    if(this.isAuthenticated){

      //fetch the logged in user details

      //user full name is exposed as a property name
      this.oktaAuth.getUser().then(
        (res)=>{
          this.userFullName=res.name as string;
          let email=res.email;
          console.log(email);
          this.storage.setItem('email',JSON.stringify(email));
        }
      )
    }
  }

  logout(){
    //Terminates the session with okta and removes current tokens.
    this.oktaAuth.signOut();
  }
}
