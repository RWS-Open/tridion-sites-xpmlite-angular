import { Component, computed, inject, OnInit, signal } from "@angular/core";

import { tap } from "rxjs";
import { HeadlessXpmModal } from "../../../shared/modal/modal";
import { XpmPageInfoService } from "../../../state/headless-xpm-page-info.service";
import { PageData } from "../../../state/headless-xpm-page.model";
import { PublishService } from "../../../state/headless-xpm-publish.service";
import { StringUtils } from "../../../utils/StringUtils";
import { AdditionalSettingsTab } from "./additional-settings-tab/additional-settings-tab";
import { GeneralTab } from "./general-tab/general-tab";
import { PublishTab } from "./publish-tabs/publish-tab/publish-tab";
import { PublishTabs } from "./publish-tabs/publish-tabs";

@Component({
    selector: 'app-publish-page-modal',
    imports: [PublishTabs, PublishTab, HeadlessXpmModal],
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
    readonly publicationId = computed(() =>  this.xpmPageInfoService.pageInfo()?.BluePrintInfo.OwningRepository.IdRef as string)
    readonly targetTypeSelected = computed(() => this.publishService.selectedTargetType().length)
    readonly selectedChildPublications = computed(() => this.publishService.selectedChildPublication().length)
    readonly selectedParentPublication = computed(() => this.publishService.selectedParentPublication())
    readonly showPublishModal = this.publishService.showPublishModal
    
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
        const pageId= this.xpmPageInfoService.pageId()
        this.publishService.publishPage(pageId as string).subscribe(res => {
            this.publishService.togglePublishModal()
            this._isPublishing.set(false)
        })
    }

    ngOnInit(): void {
        if (this.xpmPageInfoService.pageId() !== null && this.xpmPageInfoService.pageInfo() !== null) {
            const pubId = StringUtils.sanitizeIdentifier(this.publicationId())
            this.publishService.getPagePublishInfo(pubId)
        } else {
            const id = this.xpmPageInfoService.getPageId()
            if (id) {
                this.xpmPageInfoService.pageInfoLoaded(id).pipe(
                    tap((response:PageData) => {
                        this.xpmPageInfoService.updatePageInfo(response)
                    })
                ).subscribe(res => {
                    const pubId = StringUtils.sanitizeIdentifier(res.BluePrintInfo.OwningRepository.IdRef) 
                    this.publishService.getPagePublishInfo(pubId)
                })
            }
        }
    }
}