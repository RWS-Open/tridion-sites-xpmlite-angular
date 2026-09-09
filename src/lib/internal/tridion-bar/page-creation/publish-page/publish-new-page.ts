import { Component, computed, effect, inject } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { HeadlessXpmPageCreationService } from "../../../state/headless-xpm-page-creation.service";
import { PublishService } from "../../../state/headless-xpm-publish.service";
import { StepperService } from "../../../state/headless-xpm-stepper.service";
import { AdditionalSettingsTab } from "../../page-info/publish-page/additional-settings-tab/additional-settings-tab";
import { GeneralTab } from "../../page-info/publish-page/general-tab/general-tab";
import { PublishTab } from "../../page-info/publish-page/publish-tabs/publish-tab/publish-tab";
import { PublishTabs } from "../../page-info/publish-page/publish-tabs/publish-tabs";

@Component({
    selector: "app-publish-new-page",
    templateUrl: "./publish-new-page.html",
    styleUrl: "./publish-new-page.css",
    imports: [PublishTabs, PublishTab]
})

export class PublishNewPage {
    generalTab = GeneralTab;
    additionalSettingsTab = AdditionalSettingsTab;
    private destroy$ = new Subject<void>();

    private readonly stepperService = inject(StepperService)
    private readonly publishService = inject(PublishService)
    private readonly pageCreationService = inject(HeadlessXpmPageCreationService)
    selectedChildPublication = computed(() => this.publishService.selectedChildPublication())
    selectedParentPublication = computed(() => this.publishService.selectedParentPublication())
    selectedTargetType = computed(() => this.publishService.selectedTargetType())


    ngOnInit(): void {
        this.stepperService.setNextLabel('Publish');
        this.stepperService.setPrevLabel('Previous');

        this.stepperService.nextRequest$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.stepperService.isLoading.set(true);
            const pageId = this.pageCreationService.createdPageId() as string
            this.publishService.publishPage(pageId).subscribe((response) => {
                this.stepperService.isLoading.set(false);
                console.log("new Page published",response);
                this.pageCreationService.togglePageCreationModal()
            })
            this.stepperService.complete();
        });
        this.stepperService.prevRequest$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.stepperService.goback();
        });
    }

    constructor() {

        effect(() => {
            const hasPublication = this.selectedChildPublication().length !== 0 || this.selectedParentPublication()!==null;
            const hasTargetType = this.selectedTargetType().length !== 0;

            this.stepperService.canNext.set(hasPublication && hasTargetType);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.stepperService.setNextLabel('Publish');
        this.stepperService.setPrevLabel('Previous');
    }
}