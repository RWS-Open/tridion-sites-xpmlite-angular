import { Component, input, signal } from '@angular/core';
import { HeadlessXpmEditor,FieldNamePipe } from 'headless-xpm-angular';
import { Region } from '../../../../types';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [HeadlessXpmEditor, FieldNamePipe],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  tcmId=signal<string>('')
  region = input<Region>()
}
