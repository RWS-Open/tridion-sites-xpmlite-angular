import { Component, input, signal } from '@angular/core';
import { HeadlessXpmEditor } from "headless-xpm-angular";
import { ComponentData } from '../../types';

@Component({
  selector: 'app-campaign',
  imports: [HeadlessXpmEditor],
  templateUrl: './campaign.html',
  styleUrl: './campaign.css',
})
export class Campaign {
 tcmId=signal<string>('')
  components = input<ComponentData[]>()
}
