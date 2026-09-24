import { Component, computed, input } from '@angular/core';

@Component({
    selector: 'app-campaign-page-template',
    templateUrl: './campaign-page-template.html'
})

export class CampaignPageTemplate {
    readonly pageData = input<any>();

    readonly pageTcmdId = computed(() => {
        const data = this.pageData();
        if (!data) return '';
        return `tcm:${data.publicationId}-${data.itemId}-${data.itemType}`;
    });
}