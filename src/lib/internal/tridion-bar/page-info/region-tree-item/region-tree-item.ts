import { Component, inject, input } from "@angular/core";

import { XpmPageInfoService } from "../../../state/headless-xpm-page-info.service";

@Component({
    selector: "app-region-tree-item",
    templateUrl: "./region-tree-item.html",
    styleUrl: "./region-tree-item.css"
})

export class RegionTreeItem {
    private xpmPageInfoService = inject(XpmPageInfoService)

    readonly selectedItem = this.xpmPageInfoService.selectedPageitem
    regions = input.required<any[]>();

    onItemSelect(itemType: string, name: string, regionId: string, position: number) {
        this.xpmPageInfoService.setSelectedPageItem({
            name: name,
            type: itemType,
            id: regionId,
            position: position
        })
    }
}