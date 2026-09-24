import { Component, input, computed } from '@angular/core';
import { TridionComponentItem } from '../../cms/models/tridion-page.model';
import { FieldNamePipe, HeadlessXpmEditor } from 'headless-xpm-angular';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [HeadlessXpmEditor, FieldNamePipe],
    templateUrl: "./product-card.html",
    styleUrl: "./product-card.css"
})
export class ProductCardComponent {
    components = input<any[]>([])
    cardItem = computed(() => this.components());
}