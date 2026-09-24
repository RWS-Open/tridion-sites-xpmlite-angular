import { Component, input } from '@angular/core';
import { TridionComponentItem } from '../../cms/models/tridion-page.model';


@Component({
  selector: 'app-default-component',
  standalone: true,
  templateUrl:"./default-component.html" ,
  styleUrl:"./default-component.css"
})
export class DefaultCmsComponent {
  item = input<TridionComponentItem>();
  component = input<TridionComponentItem>();
}