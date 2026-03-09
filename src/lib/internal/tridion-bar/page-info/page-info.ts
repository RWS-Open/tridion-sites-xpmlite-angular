import { ChangeDetectionStrategy, Component, computed, inject, output } from "@angular/core";

import { XpmPageInfoService } from "../../state/headless-xpm-page-info.service";
import { PublishService } from "../../state/headless-xpm-publish.service";

import { ItemSelector } from "./item-selector/item-selector";
import { RegionTreeItem } from "./region-tree-item/region-tree-item";

@Component({
    selector: "app-page-info",
    imports: [ItemSelector, RegionTreeItem],
    templateUrl: "./page-info.html",
    styleUrl: './page-info.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageInfo {

    private xpmPageInfoService = inject(XpmPageInfoService)
    private publishService = inject(PublishService)

    togglePageInfo = output<void>()

    readonly selectedItem = this.xpmPageInfoService.selectedPageitem
    //readonly showPageInfoModal = this.xpmPageInfoService.showModal

    showPageInfoModal = computed(() => this.xpmPageInfoService.showModal())
    page = computed(() => this.xpmPageInfoService.pageInfo())
    pageTitle = computed(() => this.xpmPageInfoService.pageInfo()?.Title)
    isLoading = computed(() => this.xpmPageInfoService.isLoading())
    isPageUpdating = computed(() => this.xpmPageInfoService.isPageUpdating())

    onPageInfoClose() {
        this.togglePageInfo.emit()
    }

    toggleItemSelector() {
        this.xpmPageInfoService.toggleModal()
        this.xpmPageInfoService.getPageSchema();
    }

     onItemSelect(itemType: string, name: string, regionId: string, position: number) {
        this.xpmPageInfoService.setSelectedPageItem({
            name: name,
            type: itemType,
            id: regionId,
            position: position
        })
    }

    updatePageinfo() {
        this.xpmPageInfoService.savePageInfo()
    }

    deleteItem() {
        this.xpmPageInfoService.deleteComponentPresenetationItem()
    }

    togglePublishingModal() {
        this.publishService.togglePublishModal()       
    }
}