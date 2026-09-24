import { Component, input, effect, computed } from '@angular/core';
import { FieldNamePipe, HeadlessXpmEditor } from 'headless-xpm-angular';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports:[HeadlessXpmEditor, FieldNamePipe],
  templateUrl: "./banner.html",
  styleUrl: "./banner.css"
})
export class BannerComponent {
  components = input<any[]>([])

  readonly componentId = computed(() => {
    const data = this.components();
    if (!data) return '';
    return `tcm:${data[0].publicationId}-${data[0].itemId}`;
  });

}