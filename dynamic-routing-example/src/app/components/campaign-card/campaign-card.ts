import { Component, input, computed } from '@angular/core';
import { FieldNamePipe, HeadlessXpmEditor } from 'headless-xpm-angular';

@Component({
    selector: 'app-campaign-card',
    standalone: true,
    imports:[HeadlessXpmEditor, FieldNamePipe],
    templateUrl: "./campaign-card.html",
    styleUrl: "./campaign-card.css"
})
export class CampaignCardComponent {
    components = input<any[]>([])
    cardItem = computed(() => this.components());

    readonly componentId = computed(() => {
        const data = this.cardItem();
        if (!data) return '';
        return `tcm:${data[0].publicationId}-${data[0].itemId}`;
      });
}