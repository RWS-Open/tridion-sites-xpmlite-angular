import { effect, inject, Injectable, signal } from "@angular/core";
import { concatMap, map, Observable } from "rxjs";

import { PublishingStatus, publishResult } from "../tridion-bar/page-creation/publish-page/publish-new-page.model";
import { ChildPublicationsData, ChildPublicationsProps, PubishableTargets } from "../tridion-bar/page-info/publish-page/publish-page-model";
import { StringUtils } from "../utils/StringUtils";
import { XpmApiService } from "./headless-xpm-api.service";
import { AuthService } from "./headless-xpm-auth.service";
import { PublishBody } from "./headless-xpm-publish-model";

interface PublicationItemResponse {
    Id: string;
    Title: string;
    BusinessProcessType?: {
        IdRef: string;
        Title?: string;
    };
    [key: string]: unknown;
}

export interface MappedChildPublication {
    id: string;
    title: string;
}

@Injectable({
    providedIn: "root"
})

export class PublishService {
    private readonly _publishableTargetTypes = signal<PubishableTargets[]>([])
    private readonly _childPublications = signal<ChildPublicationsProps[]>([])
    private readonly _showPublishModal = signal<boolean>(false)
    private readonly _includeChildPublications = signal<boolean>(false)
    private readonly _parentPublication = signal<ChildPublicationsProps | null>(null)

    private readonly _selectedTargetType = signal<string[]>([])
    private readonly _selectedDeploymentOptions = signal<boolean>(true)
    private readonly _selectedParentPublication = signal<string | null>(null)
    private readonly _selectedChildPublications = signal<string[]>([])
    private readonly _selectedPublishingOptions = signal<boolean>(true)
    private readonly _selectedDeploymentDatetime = signal<string | null>(null)

    private readonly _selectedDependentItems = signal<boolean>(true)
    private readonly _selectedItemsInProgress = signal<boolean>(true)
    private readonly _selectedOverridePublishPriority = signal<boolean>(true)
    private readonly _selectedPublishingPriority = signal<string>("Normal")
    private readonly _isChilPublicationLoading = signal<boolean>(false)
    private readonly _isTargetTypesLoading = signal<boolean>(false)

    readonly publishableTargetTypes = this._publishableTargetTypes.asReadonly();
    readonly parentPublication = this._parentPublication.asReadonly();
    readonly childPublications = this._childPublications.asReadonly();
    readonly showPublishModal = this._showPublishModal.asReadonly();
    readonly includeChildPublications = this._includeChildPublications.asReadonly()

    readonly selectedTargetType = this._selectedTargetType.asReadonly();
    readonly selectedDeploymentOption = this._selectedDeploymentOptions.asReadonly();
    readonly selectedParentPublication = this._selectedParentPublication.asReadonly();
    readonly selectedChildPublication = this._selectedChildPublications.asReadonly();
    readonly selectedPublishingOptions = this._selectedPublishingOptions.asReadonly();
    readonly selectedDeploymentDatetime = this._selectedDeploymentDatetime.asReadonly();

    readonly selectedDependentItems = this._selectedDependentItems.asReadonly();
    readonly selectedOverridePublishPriority = this._selectedOverridePublishPriority.asReadonly();
    readonly selectedPublishingPriority = this._selectedPublishingPriority.asReadonly();
    readonly selectedItemsInProgress = this._selectedItemsInProgress.asReadonly();
    readonly isChilPublicationLoading = this._isChilPublicationLoading.asReadonly();
    readonly isTargetTypesLoading = this._isTargetTypesLoading.asReadonly();

    private apiService = inject(XpmApiService)
    private authService = inject(AuthService)

    togglePublishModal() {
        this._showPublishModal.update(value => !value)
    }

    getPagePublishInfo(publicationId: string) {

        //const publicationId = StringUtils.sanitizeIdentifier(this.xpmPageInfoService.pageInfo()?.BluePrintInfo.OwningRepository.IdRef as string)
        if (!publicationId) return;

        const url = `/items/${publicationId}?useDynamicVersion=true`;

        this.apiService.getItems<PublicationItemResponse>(url).pipe(
            concatMap((response: PublicationItemResponse): Observable<PubishableTargets[]> => {
                const businessProcessId = StringUtils.sanitizeIdentifier(response.BusinessProcessType?.IdRef as string)
                this._parentPublication.set({
                    title: response.Title,
                    id: response.Id
                })
                this._isTargetTypesLoading.set(true)
                const targetTypeUrl = `/items/${businessProcessId}/publishableTargetTypes`;
                return this.apiService.getItems<PubishableTargets[]>(targetTypeUrl);
            }),
            concatMap((targetTypeResponse: PubishableTargets[]): Observable<ChildPublicationsData[]> => {
                this._publishableTargetTypes.set(targetTypeResponse);
                this._isChilPublicationLoading.set(true)
                const childPublicationUrl = `/items/${publicationId}/publishableChildPublications`;
                return this.apiService.getItems<ChildPublicationsData[]>(childPublicationUrl);
            }),

            map((childPublicationResponse: ChildPublicationsData[]): MappedChildPublication[] => {
                return childPublicationResponse.map((publication: ChildPublicationsData) => ({
                    id: publication.Id,
                    title: publication.Title
                }));
            })
        ).subscribe({
            next: (publishingData: MappedChildPublication[]) => {
                this._childPublications.set(publishingData)
                //console.log("Mapped Child Publication data", publishingData);
            },
            error: (err) => {
                this._isChilPublicationLoading.set(false);
                this._isTargetTypesLoading.set(false);
                console.error("Failed to fetch publication info:", err);
            },
            complete: () => {
                this._isChilPublicationLoading.set(false)
                this._isTargetTypesLoading.set(false)
            },
        });
    }

    setSelectedTargetTypes(targetTypeId: string, checked: boolean) {
        if (targetTypeId && checked) {
            this._selectedTargetType.update(targetType => [...targetType, targetTypeId])
        } else {
            this._selectedTargetType.update(targetTypes => targetTypes.filter(target => target !== targetTypeId))
        }
    }

    toggleAllTargetTypes(isChecked: boolean) {
        const targetTypes = this.publishableTargetTypes().map(item => item.Id)
        if (isChecked) {
            this._selectedTargetType.set(targetTypes)
        } else {
            this._selectedTargetType.set([])
        }
    }

    setSelectedPublications(selectedPubId: string, isChecked: boolean) {
        if (isChecked) {
            this._selectedChildPublications.update(currentPublications =>
                [...currentPublications, selectedPubId]
            )
        } else {
            this._selectedChildPublications.update(childPublication => childPublication.filter(publication => publication !== selectedPubId))
        }
    }

    setSelectedParentPublication(publicationId: string | null) {
        this._selectedParentPublication.set(publicationId)
    }

    setDeploymentOptions(deployment: boolean) {
        this._selectedDeploymentOptions.set(deployment)
    }

    setPublishingOptions(publishing: boolean) {
        this._selectedPublishingOptions.set(publishing)
    }

    onIncludeChildPublications(isChecked: boolean) {
        if (isChecked) {

            this._includeChildPublications.set(true);
            const selectedChildPublications = this.childPublications().map(item => item.id);
            this._selectedChildPublications.set(selectedChildPublications)
        } else {
            this._includeChildPublications.set(false)
            this._selectedChildPublications.set([])
        }
    }

    setDeploymentDatetime(dateTime: string | null) {
        this._selectedDeploymentDatetime.set(dateTime)
    }

    setAdditionalDependentItem(dependentItem: boolean) {
        this._selectedDependentItems.set(dependentItem)
    }

    setAdditionalItemsInProgress(itemsInProgress: boolean) {
        this._selectedItemsInProgress.set(itemsInProgress)
    }

    setAdditionalPublishingPriority(publishPriority: boolean) {
        this._selectedOverridePublishPriority.set(publishPriority)
    }

    setAdditionalPriorityChange(priority: string) {
        this._selectedPublishingPriority.set(priority)
    }

    publishPage(pageId: string): Observable<publishResult> {
        const url = '/items/publish';
        const publishBody = {
            Ids: [pageId as string],
            TargetIdsOrPurposes: this._selectedTargetType(),
            PublishInstruction: {
                ResolveInstruction: {
                    IncludeChildPublications: false,
                    IncludeComponentLinks: this.selectedDependentItems(),
                    IncludeCurrentPublication: this.selectedParentPublication() !== null ? true : false,
                    IncludeDynamicVersion: !this.selectedItemsInProgress(),
                    IncludeWorkflow: this.selectedOverridePublishPriority(),
                    PublishInChildPublications: this.selectedChildPublication(),
                    PublishNewContent: this._selectedPublishingOptions()
                }
            }
        } as PublishBody
        if (!this.selectedDeploymentOption()) {
            publishBody.PublishInstruction["DeployAt"] = this.selectedDeploymentDatetime()?.toString()

        }
        if (!this._selectedOverridePublishPriority()) {
            publishBody["Priority"] = this.selectedPublishingPriority() as string
        }
        return this.apiService.publish<publishResult, PublishBody>(url, publishBody)
    }

    getPublishStatus<T = PublishingStatus>(transactionId: string): Observable<T> {
        return this.apiService.getItems(`/items/${transactionId}?useDynamicVersion=true`)
    }

    constructor() {
        effect(() => {
            if (!this.authService.isAuthenticated()) {
                this._showPublishModal.set(false)
            }
        });
    }
}