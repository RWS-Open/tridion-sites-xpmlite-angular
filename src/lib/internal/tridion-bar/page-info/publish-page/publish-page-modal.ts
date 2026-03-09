import { Component, computed, inject, OnInit, signal } from "@angular/core";

import { PublishTabs } from "./publish-tabs/publish-tabs";
import { GeneralTab } from "./general-tab/general-tab";
import { AdditionalSettingsTab } from "./additional-settings-tab/additional-settings-tab";
import { PublishItemsTab } from "./publish-items-tab/publish-items-tab";
import { PublishTab } from "./publish-tabs/publish-tab/publish-tab";
import { PublishService } from "../../../state/headless-xpm-publish.service";
import { XpmPageInfoService } from "../../../state/headless-xpm-page-info.service";
import { switchMap, tap } from "rxjs";
import { PageData } from "../../../state/headless-xpm-page.model";

@Component({
    selector: 'app-publish-page-modal',
    imports: [PublishTabs, PublishTab],
    templateUrl: "./publish-page-modal.html",
    styleUrl: "./publish-page-modal.css",
})

export class PublishPageModal implements OnInit {
    generalTab = GeneralTab;
    additionalSettingsTab = AdditionalSettingsTab;
    //publishItemsTab = PublishItemsTab
    private readonly xpmPageInfoService = inject(XpmPageInfoService)
    private readonly publishService = inject(PublishService)
    private readonly _isPublishing = signal<boolean>(false)

    readonly isPublishing = this._isPublishing.asReadonly()

    targetTypeSelected = computed(() => this.publishService.selectedTargetType().length)
    selectedChildPublications = computed(() => this.publishService.selectedChildPublication().length)
    selectedParentPublication = computed(() => this.publishService.selectedParentPublication())

    togglePublishingModal() {
        this.publishService.togglePublishModal()
    }

    isDisabled(): boolean {
        const targetTypeSelected = this.publishService.selectedTargetType().length !== 0;
        const selectedChildPublications = this.publishService.selectedChildPublication().length !== 0;
        const selectedParentPublication = this.publishService.selectedParentPublication() !== null;
        return targetTypeSelected && (selectedChildPublications || selectedParentPublication);

    }
    onPublishPage() {
        this._isPublishing.set(true)
        this.publishService.publishPage().subscribe(res => {
            this.publishService.togglePublishModal()
            this._isPublishing.set(false)
        })
    }

    ngOnInit(): void {
        if (this.xpmPageInfoService.pageId() !== null && this.xpmPageInfoService.pageInfo() !== null) {
            this.publishService.getPagePublishInfo()
        } else {
            const id = this.xpmPageInfoService.getPageId()
            if (id) {
                this.xpmPageInfoService.pageInfoLoaded(id).pipe(
                    tap((response:PageData) => {
                        this.xpmPageInfoService.updatePageInfo(response)
                    })

                ).subscribe(res => {
                    this.publishService.getPagePublishInfo()
                })
            }
        }
    }
}