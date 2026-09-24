import { Component, computed, input, OnInit } from '@angular/core';
import { FieldNamePipe, HeadlessXpmEditor } from 'headless-xpm-angular';

@Component({
    selector: 'app-products-banner',
    imports:[HeadlessXpmEditor, FieldNamePipe],
    templateUrl: './products-banner.html',
    styleUrl:"./products-banner.css"
})

export class ProductsBanner {
    components = input<any[]>([])

    readonly componentId = computed(() => {
        const data = this.components();
        if (!data) return '';
        return `tcm:${data[0].publicationId}-${data[0].itemId}`;
      });
}