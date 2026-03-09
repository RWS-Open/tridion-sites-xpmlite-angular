import { Component, input } from '@angular/core';
import { Region } from '../../../../types';

@Component({
  selector: 'app-related-items',
  imports: [],
  templateUrl: './related-items.html',
  styleUrl: './related-items.css',
})
export class RelatedItems {
  region = input<Region>()
}
