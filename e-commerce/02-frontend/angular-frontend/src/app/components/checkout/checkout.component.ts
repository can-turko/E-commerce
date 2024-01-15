import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormShopService } from 'src/app/services/form-shop.service';
import { CValidator } from 'src/app/validators/c-validator';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  totalQuantity: number = 0;

  totalPrice: number = 0.00;

  checkOutFormsGroup!: FormGroup;

  storage:Storage=sessionStorage;

  years: number[] = [];

  months: number[] = [];

  countries: Country[] = [];

  shippingStates: State[] = [];
  billingStates: State[] = [];

  stripe= Stripe(environment.publishKey);

  paymentInfo:PaymentInfo = new PaymentInfo();

  cardElement:any;

  isDisable=false;

  displayError:any="";

  constructor(private formBuilder: FormBuilder,
    private formShopService: FormShopService,
    private cartService:CartService,
    private checkoutService:CheckoutService,
    private router:Router) {

  }
  ngOnInit() {

    this.formBuild()

    //this.updateDates();
    this.getCountries();
    this.updateValues();
    this.stripeCard();
  }
  stripeCard() {
    //get a handle to stripe elements
    var elements = this.stripe.elements();

    //Create a card element ... and hide the zip-code field
    this.cardElement=elements.create('card',{hidePostalCode:true});

    //Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    //Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event:any)=>{

      //get a handle to card-errors element
      this.displayError=document.getElementById('card-errors');

      if(event.complete){
        this.displayError.textContent="";
      }else if(event.error){
        // show validation error to customer
        this.displayError.textContent = event.error.message;
      }

    })

  }
  updateValues() {
    this.cartService.totalPrice.subscribe(
      result => {
        this.totalPrice=result
      }
    )
    this.cartService.totalQuantity.subscribe(
      result =>{
        this.totalQuantity=result
      }
    )
  }



  updateDates() {
    this.formShopService.updateYear().subscribe(
      result => {
        this.years = result
      }
    )

    let currentMonth = new Date().getMonth() + 1;

    this.formShopService.updateMonth(currentMonth).subscribe(
      result => {
        this.months = result
      }
    )
  }


  formBuild() {
    const email=JSON.parse(this.storage.getItem('email')!);

    this.checkOutFormsGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CValidator.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CValidator.notOnlyWhitespace]),
        email: new FormControl(email, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),

      shippingAdress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), CValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CValidator.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CValidator.notOnlyWhitespace])
      })
      ,

      billingAdress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), CValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CValidator.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CValidator.notOnlyWhitespace])
      })
      ,

      creditCard: this.formBuilder.group({
        /*
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required,Validators.minLength(2), CValidator.notOnlyWhitespace]),
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
        */
      })

    })
  }

  get firstName() { return this.checkOutFormsGroup.get('customer.firstName'); }
  get lastName() { return this.checkOutFormsGroup.get('customer.lastName'); }
  get email() { return this.checkOutFormsGroup.get('customer.email'); }
  get shippingAdressCountry(){return this.checkOutFormsGroup.get('shippingAdress.country');}
  get shippingAdressStreet(){return this.checkOutFormsGroup.get('shippingAdress.street');}
  get shippingAdressCity(){return this.checkOutFormsGroup.get('shippingAdress.city')}
  get shippingAdressState(){return this.checkOutFormsGroup.get('shippingAdress.state')}
  get shippingAdressZipCode(){return this.checkOutFormsGroup.get('shippingAdress.zipCode')}
  get billingAdressCountry(){return this.checkOutFormsGroup.get('billingAdress.country')}
  get billingAdressStreet(){return this.checkOutFormsGroup.get('billingAdress.street')}
  get billingAdressCity(){return this.checkOutFormsGroup.get('billingAdress.city')}
  get billingAdressState(){return this.checkOutFormsGroup.get('billingAdress.state')}
  get billingAdressZipCode(){return this.checkOutFormsGroup.get('billingAdress.zipCode')}
  get creditCardCardType(){return this.checkOutFormsGroup.get('creditCard.cardType')}
  get creditCardNameOnCard(){return this.checkOutFormsGroup.get('creditCard.nameOnCard')}
  get creditCardNumber(){return this.checkOutFormsGroup.get('creditCard.cardNumber')}
  get creditCardSecurityCode(){return this.checkOutFormsGroup.get('creditCard.securityCode')}

  onSubmit() {
    if (this.checkOutFormsGroup.invalid) {
      this.checkOutFormsGroup.markAllAsTouched();
      return;
    }

    //setup order
    let order = new Order();
    order.totalPrice=this.totalPrice;
    order.totalQuantity=this.totalQuantity;

    //get cart items
    const cartItems = this.cartService.cartItems;

    //creater orderItems for cartItems
    let orderItems : OrderItem[]=[];
    for(let i = 0 ; i<cartItems.length; i++ ){
      orderItems[i]= new OrderItem(cartItems[i])
    }

    //setup purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer=this.checkOutFormsGroup.controls['customer'].value;

    //populate purchase - shipping address
    purchase.shippingAddress= this.checkOutFormsGroup.controls['shippingAdress'].value;
    let shippingCountry:Country=JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    let shippingState:State=JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    purchase.shippingAddress.state=shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;    

    //populate purchase - billing address
    purchase.billingAddress=this.checkOutFormsGroup.controls['billingAdress'].value;
    let billingState:State=JSON.parse(JSON.stringify(purchase.billingAddress.state));
    let billingCountry:Country=JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.country=billingCountry.name;
    purchase.billingAddress.state=billingState.name;

    //populate purchase - order and orderItems
    purchase.order=order;
    purchase.orderItems=orderItems;

    //populate payment info
    this.paymentInfo.amount=Math.round(this.totalPrice*100);
    this.paymentInfo.currency="USD";
    this.paymentInfo.receiptEmail=purchase.customer.email;

    //check form
    //if vaid form -create payment intent
    //confirm card payment
    //-place order

    if(!this.checkOutFormsGroup.invalid && this.displayError.textContent===''){
      this.isDisable=true;
      this.checkoutService.placePayment(this.paymentInfo).subscribe(
        (paymentIntentResponse)=>{
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method:{
                card:this.cardElement,
                billing_details:{
                  email:purchase.customer.email,
                  name:`${purchase.customer.firstName}${purchase.customer.lastName}`,
                  address:{
                    line1:purchase.billingAddress.street,
                    city:purchase.billingAddress.city,
                    state:purchase.billingAddress.state,
                    postal_code:purchase.billingAddress.zipCode,
                    country:purchase.billingAddress.country
                  }
                }
              }
            }, {handleActions:false})
            .then((result:any) =>{
              if(result.error){
                //inform the customer there was an error
                alert('There was an error: '+result.error.message);
                this.isDisable=false;

              }
              else{
                //call resut api via the checkoutservice
                this.checkoutService.placeOrder(purchase).subscribe({
                  next:(response:any)=>{
                    alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`)
                    
                    //reset cart
                    this.resetCart();
                    this.isDisable=false;
                  },
                  error:(err:any) =>{
                    alert(`There was an error ${err.message}`);
                    this.isDisable=false;
                  }
                })
              }
            });
        }
      )
    }
    else{
      this.checkOutFormsGroup.markAllAsTouched();
      return;
    }
    
  }
  resetCart() {
    this.cartService.cartItems=[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItem();

    this.router.navigateByUrl("/products");
  }

  fieldsChange(values: any) {
    if (values.currentTarget.checked) {
      this.checkOutFormsGroup.controls['billingAdress'].setValue(this.checkOutFormsGroup.controls['shippingAdress'].value);
      this.billingStates = this.shippingStates;
    }
    else {
      this.checkOutFormsGroup.controls['billingAdress'].reset();
      this.billingStates = [];
    }
  }


  yearChange(): void {
    let creditYearFormGroup = this.checkOutFormsGroup.get('creditCard');

    let selectedYear = Number(creditYearFormGroup?.value.expirationYear);
    let currentYear = new Date().getFullYear();
    let expectedMonth: number;

    if (selectedYear == currentYear) {
      expectedMonth = new Date().getMonth() + 1;
    }
    else {
      expectedMonth = 1;
    }

    this.formShopService.updateMonth(expectedMonth).subscribe(
      result => {
        this.months = result;
      }
    )
  }

  getCountries() {
    this.formShopService.getCountries().subscribe(
      result => { this.countries = result }
    )
  }

  handleStates(formGroupName: string) {

    const formGroup = this.checkOutFormsGroup.get(formGroupName);
    const countryCode: string = formGroup?.value.country.code;
    this.formShopService.getStates(countryCode).subscribe(
      result => {
        if (formGroupName == 'shippingAdress') {
          this.shippingStates = result;
        }
        else {
          this.billingStates = result;
        }
        formGroup!.get('state')!.setValue(result[0])
      }
    )
  }


}
