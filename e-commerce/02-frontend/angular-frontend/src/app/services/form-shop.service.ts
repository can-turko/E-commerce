import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { HttpClient } from '@angular/common/http';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormShopService {

  countryUrl= environment.myBackendUrl+'/countries';
  stateUrl=environment.myBackendUrl+'/states';

  constructor(private httpClient:HttpClient) { }

  updateMonth(currentMonth:number):Observable<number[]>{

    let data:number[]=[];

    for(let month = currentMonth; month <= 12; month++){
      data.push(month);
    }

    return of(data);
  }

  updateYear():Observable<number[]>{
    let data:number[]=[]

    let currentYear= new Date().getFullYear();
    let lastYear= currentYear+10;

    for(let year=currentYear; year<=lastYear; year++){
      data.push(year)
    }

    return of(data)
  }

  getCountries():Observable<Country[]>{

    return this.httpClient.get<GetCountries>(this.countryUrl).pipe(
      map(result => result._embedded.countries)
    );
  }

  getStates(countryCode:string):Observable<State[]>{
    let theUrl=`${this.stateUrl}/search/findByCountryCode?code=${countryCode}`;
    return this.httpClient.get<GetStates>(theUrl).pipe(
      map(result => result._embedded.states))
  }

}

interface GetCountries{
  _embedded:{
    countries:Country[]
  }
}

interface GetStates{
  _embedded:{
    states:State[]
  }
}
