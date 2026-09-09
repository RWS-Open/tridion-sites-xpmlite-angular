import { NgClass } from "@angular/common";
import { Component, computed, inject, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { StepperService } from "../../../state//headless-xpm-stepper.service";
import { HeadlessXpmPageCreationService } from "../../../state/headless-xpm-page-creation.service";
import { PageTypesProps } from "./page-types.model";


@Component({
    selector: "app-page-types",
    templateUrl: "./page-types.html",
    styleUrl: "./page-types.css",
    imports: [NgClass]
})

export class PageTypes implements OnInit, OnDestroy {
    // Implementation for page types
    private destroy$ = new Subject<void>();
    private readonly pageCreationService = inject(HeadlessXpmPageCreationService)
    private readonly stepperService = inject(StepperService);

    pageTypes = computed(() => this.pageCreationService.pageTypes())
    isLoading = computed(() => this.pageCreationService.isPageTypesLoading())
    selecetedPageType = computed(() => this.pageCreationService.selectedPageType())

    updateSelectedPageType(pageType: PageTypesProps) {
        this.pageCreationService.setSelectedPageType(pageType)
        this.stepperService.canNext.set(true);
    }

    ngOnInit(): void {
        this.stepperService.setNextLabel('Next');
        this.stepperService.setPrevLabel('Previous');
        this.stepperService.canPrev.set(false);
        this.pageCreationService.getPageTypes();

        if (!this.selecetedPageType()) {
            this.stepperService.canNext.set(false);
        }

        this.stepperService.nextRequest$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            if (this.selecetedPageType()) {
                this.stepperService.isLoading.set(false);
                this.stepperService.complete();
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.stepperService.setNextLabel('Next');
        this.stepperService.setPrevLabel('Previous');
    }
}