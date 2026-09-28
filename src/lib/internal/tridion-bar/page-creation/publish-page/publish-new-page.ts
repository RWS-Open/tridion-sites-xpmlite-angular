import { Component, computed, effect, inject, input } from "@angular/core";
import { filter, Observable, of, Subject, switchMap, take, takeUntil, takeWhile, throwError, timer } from "rxjs";
import { NotificationService } from "../../../state/headless-xpm-notification.service";
import { HeadlessXpmPageCreationService } from "../../../state/headless-xpm-page-creation.service";
import { HeadlessXpmProviderState } from "../../../state/headless-xpm-provider.state";
import { PublishService } from "../../../state/headless-xpm-publish.service";
import { StepperService } from "../../../state/headless-xpm-stepper.service";
import { StringUtils } from "../../../utils/StringUtils";
import { AdditionalSettingsTab } from "../../page-info/publish-page/additional-settings-tab/additional-settings-tab";
import { GeneralTab } from "../../page-info/publish-page/general-tab/general-tab";
import { PublishTab } from "../../page-info/publish-page/publish-tabs/publish-tab/publish-tab";
import { PublishTabs } from "../../page-info/publish-page/publish-tabs/publish-tabs";
import { PublishingStatus, publishResult } from "./publish-new-page.model";

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

    private readonly providerService = inject(HeadlessXpmProviderState)
    private readonly stepperService = inject(StepperService)
    private readonly publishService = inject(PublishService)
    private readonly pageCreationService = inject(HeadlessXpmPageCreationService)
    private readonly notificationService = inject(NotificationService);

    selectedChildPublication = computed(() => this.publishService.selectedChildPublication())
    selectedParentPublication = computed(() => this.publishService.selectedParentPublication())
    selectedTargetType = computed(() => this.publishService.selectedTargetType())
    sitemapPageId = input<string | null>(null)

    ngOnInit(): void {
        this.stepperService.setNextLabel('Publish');
        this.stepperService.setPrevLabel('Previous');

        this.stepperService.nextRequest$.pipe(
            takeUntil(this.destroy$),
            switchMap(() => {
                this.stepperService.isLoading.set(true);

                const pageId = this.pageCreationService.createdPageId() as string;

                return this.publishService.publishPage(pageId).pipe(
                    switchMap((publishResult: publishResult) => {
                        const transactionId = publishResult.PublishTransactionIds[0]
                        return this.pollPublishStatus(transactionId, 20, 3000)
                    }),
                    switchMap(() => {
                        const sitemapPageId = this.providerService.sitemapPageId()
                        if (!sitemapPageId) {
                            return of(null);
                        }
                        return this.publishService.publishPage(this.providerService.sitemapPageId() as string);
                    })
                )
            })
        ).subscribe({
            next: () => {
                this.stepperService.isLoading.set(false);
                this.pageCreationService.togglePageCreationModal();
                this.stepperService.complete();

                this.notificationService.success("Success", `Page has been published successfully!.`);
            },
            error: (error) => {
                console.error('Publishing failed:', error);
                this.stepperService.isLoading.set(false);
                this.notificationService.error('Error', error?.error?.Message || error);
            }
        })
        this.stepperService.prevRequest$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.stepperService.goback();
        });
    }

    constructor() {
        effect(() => {
            const hasPublication = this.selectedChildPublication().length !== 0 || this.selectedParentPublication() !== null;
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

    private pollPublishStatus(transactionId: string, MAX_ATTEMPTS: number = 20, POLL_INTERVAL_MS: number = 3000): Observable<PublishingStatus> {
        const sanitizedId = StringUtils.sanitizeIdentifier(transactionId);
        let currentAttempt = 0;

        return timer(0, POLL_INTERVAL_MS).pipe(
            take(MAX_ATTEMPTS),
            switchMap(() => {
                currentAttempt++;
                return this.publishService.getPublishStatus<PublishingStatus>(sanitizedId);
            }),
            switchMap((res: PublishingStatus) => {
                const state = (res?.State || '').toLowerCase();

                if (state === 'failed') {
                    this.notificationService.error('Error', res?.Message || 'Failed to Publish');
                    return throwError(() => new Error(res?.Message || 'Failed to Publish'));
                }

                const isFinished = res?.IsCompleted || state === 'success';
                if (currentAttempt >= MAX_ATTEMPTS && !isFinished) {
                    this.notificationService.error('Error', `Publishing timed out after ${MAX_ATTEMPTS} attempts. Last state: '${state}'.`);
                    return throwError(() => new Error(`Publishing timed out after ${MAX_ATTEMPTS} attempts. Last state: '${state}'.`));
                }

                return of(res);
            }),

            takeWhile((res: PublishingStatus) => {
                const state = (res?.State || '').toLowerCase();
                const isSuccess = state === 'success';
                const isDone = res?.IsCompleted ?? isSuccess;
                return !isDone && !isSuccess;
            }, true),
            filter((res: PublishingStatus) => {
                const state = (res?.State || '').toLowerCase();
                return state === 'success' || !!res?.IsCompleted;
            }),
            take(1)
        );
    }
}