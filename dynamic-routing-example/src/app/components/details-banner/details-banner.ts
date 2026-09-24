import { Component, effect, input, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
@Component({
    selector: 'app-details-banner',
    standalone: true,
    imports: [CarouselModule],
    templateUrl: './details-banner.html',
    styleUrl: "./details-banner.css"
})

export class DetailsBanner {
    components = input<any[]>([])
    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        dots: true,
        navSpeed: 700,
        navText: ['Next', 'Previous'],
        responsive: {
          940: {
            items: 1
          }
        },
        nav: true
      }
    constructor() {
        effect(() => {
            console.log(this.components())
        })
    }
}