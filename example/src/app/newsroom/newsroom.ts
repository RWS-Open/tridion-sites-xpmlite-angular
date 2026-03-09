import { Component, input, signal } from '@angular/core';
import { HeadlessXpmEditor } from "headless-xpm-angular";
import { ComponentData } from '../../types';

@Component({
  selector: 'app-newsroom',
  imports: [HeadlessXpmEditor],
  templateUrl: './newsroom.html',
  styleUrl: './newsroom.css',
})
export class Newsroom {
  tcmId=signal<string>('')
  components = input<ComponentData[]>()
}
