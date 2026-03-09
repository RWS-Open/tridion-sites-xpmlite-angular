import { Component, computed, inject } from "@angular/core";
import { AppService } from "../../app.service";
import { Banner } from "./banner/banner";
import { Product } from "./product/product";
import { Campaign } from "./campaign/campaign";
import { Newsroom } from "./newsroom/newsroom";

@Component({
    selector: "app-home",
    styleUrl: "./home.css",
    templateUrl: "./home.html",
    imports: [Banner, Product, Campaign, Newsroom]
})

export class Home {

    private pageService = inject(AppService)

    readonly pageId = computed(() => `tcm:${this.pageService.pageData()?.data.typedPage.publicationId}-${this.pageService.pageData()?.data.typedPage.itemId}-${this.pageService.pageData()?.data.typedPage.itemType}`)
    readonly typedPageData = computed(() => this.pageService.pageData())
    readonly pageTcmId =computed(() =>  `tcm:${this.pageService.pageData()?.data.typedPage.publicationId}-${this.typedPageData()?.data.typedPage.itemId}-${this.typedPageData()?.data.typedPage.itemType}`)
}