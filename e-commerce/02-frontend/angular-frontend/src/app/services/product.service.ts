import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators'
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  theBaseUrl = environment.myBackendUrl+'/products';
  theCategoryUrl = environment.myBackendUrl+'/product-category';



  constructor(public httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]>{

    const searchUrl = `${this.theBaseUrl}/search/findByCategoryId?id=${theCategoryId}`

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(result => result._embedded.products)
    );
  }
  getProductListPage(thePage:number,
                     thePageSize:number,
                     theCategoryId:number):Observable<GetResponseProducts>{

    const url = `${this.theBaseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);

  }

  getProductCategories():Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseCategory>(this.theCategoryUrl).pipe(
      map(result => result._embedded.productCategory)
    )

  }

  getProductListByContaininName(keyword:string): Observable<Product[]>{
    const theContaininUrl=`${this.theBaseUrl}/search/findByNameContaining?name=${keyword}`;
    
    return this.httpClient.get<GetResponseProducts>(theContaininUrl).pipe(
      map(result => result._embedded.products)
    );
  }

  getProductListByContaininNamePage(keyword:string, pageSize:number, pageNumber:number): Observable<GetResponseProducts>{
    const theContaininUrl=`${this.theBaseUrl}/search/findByNameContaining?name=${keyword}&page=${pageNumber}&size=${pageSize}`;
    
    return this.httpClient.get<GetResponseProducts>(theContaininUrl);
  }

  getProduct(id: number):Observable<Product> {
    const productUrl= `${this.theBaseUrl}/${id}`;
    return this.httpClient.get<Product>(productUrl);
  }

}

interface GetResponseProducts{
  _embedded: {
    products: Product[]
  },
  page:{
    size:number,
    totalElements:number,
    totalPages:number,
    number:number
  }
}

interface GetResponseCategory{
  _embedded: {
    productCategory: ProductCategory[]
  }
}
