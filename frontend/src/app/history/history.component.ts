import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/orders/history/').subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (error) => {
        console.error('Load history error:', error);
      }
    });
  }

  getTotalItems(order: any): number {
    return order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }

  getTotalPrice(order: any): number {
    return order.items.reduce((sum: number, item: any) => sum + (item.food_price * item.quantity), 0);
  }
}