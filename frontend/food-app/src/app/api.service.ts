import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}


  getFoods(id: number): Observable<any> {
    return this.http.get(this.baseUrl + `restaurants/${id}/foods/`);
  }
  getRestaurants() {
    return this.http.get('http://127.0.0.1:8000/api/restaurants/');
  }
  getFood(restaurantId: number) {
    return this.http.get(
      `http://127.0.0.1:8000/api/restaurants/${restaurantId}/foods/`
    );
  }
}