import { Component, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FieldNamePipe, HeadlessXpmEditor } from 'headless-xpm-angular';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-related-content',
    imports: [CarouselModule, RouterLink, HeadlessXpmEditor, FieldNamePipe],
    templateUrl: './related-content.html',
    styleUrl: "./related-content.css"
})

export class RelatedContent {
    components = input<any[]>([])
    customOptions: OwlOptions = {
        loop: false, 
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        navSpeed: 700,
        navText: ['‹', '›'],
        responsive: {
          0: { items: 1 },
          576: { items: 2 },
          992: { items: 3 }
        },
        nav: true
      };
}