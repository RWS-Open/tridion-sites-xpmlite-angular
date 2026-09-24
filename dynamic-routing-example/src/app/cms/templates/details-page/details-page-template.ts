import { Component, computed, input } from '@angular/core';
import { DetailsBanner } from '../../../components/details-banner/details-banner';
import { HeadlessXpmEditor } from 'headless-xpm-angular';

@Component({
    selector: 'app-details-page-template',
    standalone: true,
    imports: [DetailsBanner, HeadlessXpmEditor],
    templateUrl: './details-page-template.html'
})

export class DetailsPageTemplate {
    readonly pageData = input<any>();

    readonly pageTcmdId = computed(() => {
        const data = this.pageData();
        if (!data) return '';
        return `tcm:${data.publicationId}-${data.itemId}-${data.itemType}`;
    });
}