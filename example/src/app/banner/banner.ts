import { Component, input, signal } from '@angular/core';
import { HeadlessXpmEditor } from 'headless-xpm-angular';
import { ComponentData } from '../../types';

@Component({
  selector: 'app-banner',
  imports: [HeadlessXpmEditor],
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner {
  components = input<ComponentData[]>()
}
