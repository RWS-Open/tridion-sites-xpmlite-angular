import { Component, computed, input, OnInit } from '@angular/core';

@Component({
    selector: 'app-content-page-template',
    templateUrl: './content-page-template.html'
})

export class ContentPageTemplate {
    readonly pageData = input<any>();

    readonly pageTcmdId = computed(() => {
        const data = this.pageData();
        if (!data) return '';
        return `tcm:${data.publicationId}-${data.itemId}-${data.itemType}`;
    });
}