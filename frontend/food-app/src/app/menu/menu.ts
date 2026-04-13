import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.sass'],
})
export class Menu implements OnInit {

  foods: any[] = [];
  restaurantId!: number;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id'));

    this.api.getFood(this.restaurantId).subscribe((data: any) => {
      this.foods = data;
    });
  }

  addToCart(food: any) {
    console.log("Added:", food);
  }
}