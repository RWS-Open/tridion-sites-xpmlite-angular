import { Component, input } from '@angular/core';
import { Region } from '../../../../types';
import { FieldNamePipe, HeadlessXpmEditor } from 'headless-xpm-angular';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-product-items',
  imports: [FieldNamePipe, HeadlessXpmEditor, RouterLink],
  templateUrl: './product-items.html',
  styleUrl: './product-items.css',
})
export class ProductItems {
region = input<Region>()
}
