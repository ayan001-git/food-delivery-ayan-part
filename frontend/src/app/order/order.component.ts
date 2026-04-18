import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  foods: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFoods();
  }

  loadFoods(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/restaurants/1/foods/').subscribe({
      next: (data) => {
        this.foods = data;
      },
      error: (error) => {
        console.error('Load foods error:', error);
      }
    });
  }

  addToCart(foodId: number): void {
    this.http.post('http://127.0.0.1:8000/api/cart/add/', {
      food_id: foodId,
      quantity: 1
    }).subscribe({
      next: () => {
        alert('Item added to cart');
      },
      error: (error) => {
        console.error('Add to cart error:', error);
      }
    });
  }
}