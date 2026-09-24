import { Component, computed, input } from '@angular/core';
import { ProductsBanner } from '../../../components/products-banner/products-banner';
import { Solutions } from '../../../components/solutions/solutions';
import { RelatedContent } from '../../../components/related-content/related-content';

@Component({
  selector: 'app-products-page-template',
  imports: [ProductsBanner, Solutions, RelatedContent],
  standalone: true,
  templateUrl: './products-page-template.html'
})

export class ProductsPageTemplate {
  readonly pageData = input<any>();

  readonly pageTcmdId = computed(() => {
    const data = this.pageData();
    if (!data) return '';
    return `tcm:${data.publicationId}-${data.itemId}-${data.itemType}`;
  });
}