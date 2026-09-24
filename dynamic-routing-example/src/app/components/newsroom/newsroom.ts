import { Component, computed, input } from '@angular/core';
import { FieldNamePipe, HeadlessXpmEditor } from 'headless-xpm-angular';

@Component({
    selector: 'app-newsroom',
    imports:[HeadlessXpmEditor, FieldNamePipe],
    templateUrl: './newsroom.html',
    styleUrl:"./newsroom.css"
})

export class Newsroom {
    components = input<any[]>([])

    readonly componentId = computed(() => {
        const data = this.components();
        if (!data) return '';
        return `tcm:${data[0].publicationId}-${data[0].itemId}`;
      });
}