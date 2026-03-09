import { Component, input } from '@angular/core';
import { HeadlessXpmEditor, FieldNamePipe } from 'headless-xpm-angular';
import { Region } from '../../../../types';


@Component({
  selector: 'app-banner',
  imports: [HeadlessXpmEditor, FieldNamePipe],
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner {
  region = input<Region>()
}
