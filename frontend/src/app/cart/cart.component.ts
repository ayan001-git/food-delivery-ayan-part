import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  orders: any[] = [];
  selectedItems: number[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/orders/').subscribe({
      next: (data) => {
        this.orders = data.filter(order => order.items && order.items.length > 0);
        this.selectedItems = [];
      },
      error: (error) => {
        console.error('Load orders error:', error);
      }
    });
  }

  increaseQuantity(itemId: number): void {
    this.http.post('http://127.0.0.1:8000/api/cart/update-quantity/', {
      item_id: itemId,
      action: 'increase'
    }).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Increase quantity error:', error);
      }
    });
  }

  decreaseQuantity(itemId: number): void {
    this.http.post('http://127.0.0.1:8000/api/cart/update-quantity/', {
      item_id: itemId,
      action: 'decrease'
    }).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Decrease quantity error:', error);
      }
    });
  }

  removeItem(itemId: number): void {
    this.http.post('http://127.0.0.1:8000/api/cart/remove/', {
      item_id: itemId
    }).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Remove error:', error);
      }
    });
  }

  deleteSelected(): void {
    if (this.selectedItems.length === 0) {
      alert('Please select items first');
      return;
    }

    this.http.post('http://127.0.0.1:8000/api/cart/delete-selected/', {
      item_ids: this.selectedItems
    }).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Delete selected error:', error);
      }
    });
  }

  clearCart(): void {
    this.http.post('http://127.0.0.1:8000/api/cart/clear/', {}).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Clear cart error:', error);
      }
    });
  }

  checkout(): void {
    this.http.post('http://127.0.0.1:8000/api/cart/checkout/', {}).subscribe({
      next: () => {
        alert('Order completed');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Checkout error:', error);
      }
    });
  }

  toggleItemSelection(itemId: number): void {
    if (this.selectedItems.includes(itemId)) {
      this.selectedItems = this.selectedItems.filter(id => id !== itemId);
    } else {
      this.selectedItems = [...this.selectedItems, itemId];
    }
  }

  isItemSelected(itemId: number): boolean {
    return this.selectedItems.includes(itemId);
  }

  selectAllItems(): void {
    const allItemIds = this.orders.flatMap(order => order.items.map((item: any) => item.id));
    this.selectedItems = [...allItemIds];
  }

  clearSelection(): void {
    this.selectedItems = [];
  }

  areAllItemsSelected(): boolean {
    const allItemIds = this.orders.flatMap(order => order.items.map((item: any) => item.id));
    return allItemIds.length > 0 && allItemIds.every((id: number) => this.selectedItems.includes(id));
  }

  toggleSelectAll(): void {
    if (this.areAllItemsSelected()) {
      this.clearSelection();
    } else {
      this.selectAllItems();
    }
  }

  getTotalItems(order: any): number {
    return order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }

  getTotalPrice(order: any): number {
    return order.items.reduce((sum: number, item: any) => sum + (item.food_price * item.quantity), 0);
  }

  getSelectedCount(): number {
    return this.selectedItems.length;
  }
}