import { Component, input } from '@angular/core';
import { Region } from '../../../../types';
import { FieldNamePipe, HeadlessXpmEditor } from 'headless-xpm-angular';

@Component({
  selector: 'app-product-banner',
  imports: [FieldNamePipe, HeadlessXpmEditor],
  templateUrl: './product-banner.html',
  styleUrl: './product-banner.css',
})
export class ProductBanner {
region = input<Region>()
}
