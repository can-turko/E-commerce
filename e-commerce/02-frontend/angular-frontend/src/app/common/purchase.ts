import { Adress } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase {
    customer!:Customer;
    shippingAddress!: Adress;
    billingAddress!: Adress;
    order!:Order;
    orderItems!:OrderItem[];
}
