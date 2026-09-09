import { Component, computed, inject, OnDestroy, OnInit } from "@angular/core";

import { Subject, takeUntil } from "rxjs";
import { HeadlessXpmPageCreationService } from "../../../state/headless-xpm-page-creation.service";
import { PublishService } from "../../../state/headless-xpm-publish.service";
import { StepperService } from "../../../state/headless-xpm-stepper.service";
import { StringUtils } from "../../../utils/StringUtils";
import { PageRegion } from "../../page-region/page-region";

@Component({
    selector: "app-save-page",
    templateUrl: "./save-page.html",
    styleUrl: "./save-page.css",
    imports: [PageRegion]
})

export class SavePage implements OnInit, OnDestroy {
    // Implementation for save page
    private destroy$ = new Subject<void>();
    private readonly pageCreationService = inject(HeadlessXpmPageCreationService)
    private readonly stepperService = inject(StepperService);
    private readonly publishService = inject(PublishService)

    page = computed(() => this.pageCreationService.defaultPageStructure())
    pageInfoError = computed(() => this.pageCreationService.pageInfoError())
    isPageInfoLoading = computed(() => this.pageCreationService.isPageInfoLoading())

    ngOnInit(): void {
        this.stepperService.setNextLabel('Save');
        this.stepperService.setPrevLabel('Previous');
        this.stepperService.canNext.set(true);
        this.stepperService.setStepError(null)
        this.stepperService.nextRequest$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.stepperService.isLoading.set(true);
            this.pageCreationService.createPage().subscribe({
                next: (pageResponse: any) => {
                    if (pageResponse) {
                        console.log(pageResponse)
                        this.pageCreationService.updateNewPageId(pageResponse.Id)
                        const publicationId = StringUtils.sanitizeIdentifier(pageResponse.BluePrintInfo.OwningRepository.IdRef)
                        this.publishService.getPagePublishInfo(publicationId)
                        this.stepperService.isLoading.set(false);
                        this.stepperService.complete();
                        this.stepperService.setStepError(null)
                    }
                }, error: (err) => {
                    console.error('Error creating page:', err)
                    this.stepperService.setStepError(err.error.Message)
                    this.stepperService.isLoading.set(false);
                    this.stepperService.canNext.set(false);
                }
            })
        });
        this.stepperService.prevRequest$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.stepperService.goback();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.stepperService.setNextLabel('Save');
        this.stepperService.setPrevLabel('Previous');
    }
}