import { Component, input, signal } from '@angular/core';
import { FieldNamePipe, HeadlessXpmEditor } from "headless-xpm-angular";
import { Region } from '../../../../types';

@Component({
  selector: 'app-newsroom',
  imports: [HeadlessXpmEditor, FieldNamePipe],
  templateUrl: './newsroom.html',
  styleUrl: './newsroom.css',
})
export class Newsroom {
  tcmId=signal<string>('')
  region = input<Region>()
}
