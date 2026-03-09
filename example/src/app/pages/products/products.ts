import { Component, computed, inject, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ProductBanner } from "./product-banner/product-banner";
import { ProductItems } from "./product-items/product-items";
import { RelatedItems } from "./related-items/related-items";
import { RequestInfo } from "./request-info/request-info";

@Component({
  selector: 'app-products',
  imports: [ProductBanner, ProductItems, RelatedItems],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  //readonly pageTcmId = "tcm:7-726-64"
  private pageService = inject(AppService)
  readonly pageId = computed(() => `tcm:${this.pageService.pageData()?.data.typedPage.publicationId}-${this.pageService.pageData()?.data.typedPage.itemId}-${this.pageService.pageData()?.data.typedPage.itemType}`)

  readonly typedPageData = computed(() => this.pageService.pageData())

  ngOnInit(): void {
    console.log(this.typedPageData())
  }
}