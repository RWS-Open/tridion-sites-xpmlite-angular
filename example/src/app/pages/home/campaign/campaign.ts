import { Component, input, signal } from '@angular/core';
import { FieldNamePipe, HeadlessXpmEditor } from "headless-xpm-angular";
import { Region } from '../../../../types';

@Component({
  selector: 'app-campaign',
  imports: [HeadlessXpmEditor, FieldNamePipe],
  templateUrl: './campaign.html',
  styleUrl: './campaign.css',
})
export class Campaign {
 tcmId=signal<string>('')
  region = input<Region>()
}
