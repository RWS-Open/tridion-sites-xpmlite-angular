import { Component, computed, input } from '@angular/core';
import { BannerComponent } from '../../../components/banner/banner';
import { ProductCardComponent } from '../../../components/product-card/product-card';
import { Newsroom } from '../../../components/newsroom/newsroom';
import { CampaignCardComponent } from '../../../components/campaign-card/campaign-card';
import { HeadlessXpmProvider } from 'headless-xpm-angular';

@Component({
  selector: 'app-home-page-template',
  templateUrl: './home-page-template.html',
  standalone: true,
  imports: [BannerComponent, ProductCardComponent, CampaignCardComponent, Newsroom]
})
export class HomePageTemplate {
  readonly pageData = input<any>();

  readonly pageTcmdId = computed(() => {
    const data = this.pageData();
    if (!data) return '';
    return `tcm:${data.publicationId}-${data.itemId}-${data.itemType}`;
  });

}