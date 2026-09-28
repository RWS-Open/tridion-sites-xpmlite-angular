import { inject, Injectable, signal } from "@angular/core";
import { catchError, finalize, forkJoin, map, Observable, of, Subject, switchMap, takeUntil, tap, throwError } from "rxjs";
import { FolderItem } from "../tridion-bar/page-creation/page-details/page-details.model";
import { StructureGroup } from "../tridion-bar/page-creation/page-types/page-types.model";
import { OrganizationalItemData } from "../tridion-bar/page-info/item-selector/item-selector.model";
import { CheckInPayload } from "../tridion-bar/page-info/page-info.model";
import { StringUtils } from "../utils/StringUtils";
import { XpmApiService } from "./headless-xpm-api.service";
import { FormPageData } from "./headless-xpm-common.model";
import { ComponentData } from "./headless-xpm-inline-editor.model";
import { NotificationService } from "./headless-xpm-notification.service";
import { ComponentPresentationItem, ItemActionResponse, MappedPageType, PageDataResponse, PageStructure, PageTypeRawItem } from "./headless-xpm-page-creation.model";
import { XpmPageInfoService } from "./headless-xpm-page-info.service";
import { PageData } from "./headless-xpm-page.model";

@Injectable({
    providedIn: 'root'
})
export class HeadlessXpmPageCreationService {

    private readonly apiService = inject(XpmApiService)
    private readonly xpmPageInfoService = inject(XpmPageInfoService)
    private readonly notificationService = inject(NotificationService)

    private readonly _structureGroup = signal<StructureGroup[]>([])
    private readonly _createdPageId = signal<string | null>(null)
    private readonly _isPageTypesLoading = signal<boolean>(false)
    private readonly _showPageCreationModal = signal<boolean>(false)
    private readonly _pageTypes = signal<MappedPageType[]>([])
    private readonly _defaultPageStructure = signal<PageStructure | null>(null)
    private readonly _selectedPageType = signal<MappedPageType | null>(null)
    private readonly _formPageData = signal<FormPageData | null>(null)
    private readonly _selectedPage = signal<PageData | null>(null)
    private readonly _isPageInfoLoading = signal<boolean>(false)
    private readonly _pageInfoError = signal<string | null>(null)

    readonly structureGroup = this._structureGroup.asReadonly()
    readonly isPageTypesLoading = this._isPageTypesLoading.asReadonly();
    readonly showPageCreationModal = this._showPageCreationModal.asReadonly();
    readonly pageTypes = this._pageTypes.asReadonly();
    readonly selectedPageType = this._selectedPageType.asReadonly();
    readonly defaultPageStructure = this._defaultPageStructure.asReadonly();
    readonly formPageData = this._formPageData.asReadonly();
    readonly selectedPage = this._selectedPage.asReadonly();
    readonly createdPageId = this._createdPageId.asReadonly();
    readonly isPageInfoLoading = this._isPageInfoLoading.asReadonly();
    readonly pageInfoError = this._pageInfoError.asReadonly();

    private destroy$ = new Subject<void>();

    togglePageCreationModal() {
        this._showPageCreationModal.set(!this.showPageCreationModal())
    }

    getPageTypes(): void {
        // Get Page Id
        const pageId = this.xpmPageInfoService.getPageId();
        if (!pageId) return;
        this._isPageTypesLoading.set(true)

        const escapedPageId = StringUtils.sanitizeIdentifier(pageId as string)
        const baseUrl = (id: string) => `/items/${StringUtils.sanitizeIdentifier(id)}/items?useDynamicVersion=true`;

        // Implementation for fetching page types
        this.apiService.getItems<PageData>(`/items/${escapedPageId}?useDynamicVersion=true`).pipe(
            // Get Organizational Item
            switchMap((response: PageData) => {
                //console.log(response)
                const organizationalItemId = StringUtils.sanitizeIdentifier(response.BluePrintInfo.OwningRepository.IdRef)
                return this.apiService.getItems<OrganizationalItemData[]>(baseUrl(organizationalItemId))
            }),
            // Get Home Structure Group
            switchMap((structureGroups: OrganizationalItemData[]) => {
                const homeStructuregroup = structureGroups.find(item => item.$type === "StructureGroup" && item.Title === 'Home')

                if (!homeStructuregroup) {
                    return throwError(() => new Error("Structure Group 'Home' not found."));
                }

                return this.apiService.getItems<OrganizationalItemData[]>(baseUrl(homeStructuregroup.Id));
            }),
            // Get Page Types
            switchMap((homeStructureGroupResponse: OrganizationalItemData[]) => {
                const pageTypesStructureGroupId = homeStructureGroupResponse.find(item => item.Title === "_Page Types")
                return this.apiService.getItems<PageTypeRawItem[]>(baseUrl(pageTypesStructureGroupId?.Id as string))
            }),
            map((pageTypes: PageTypeRawItem[]): MappedPageType[] =>
                pageTypes.map((template) => ({
                    pageId: template.Id,
                    pageTitle: template.Title,
                    pageSchema: {
                        schemaId: template.RegionSchema.IdRef,
                        schemaTitle: template.RegionSchema.Title ?? '',
                    },
                    pageTemplate: {
                        templateId: template.PageTemplate.IdRef,
                        templateTitle: template.PageTemplate.Title ?? '',
                    },
                    publicationId: template.BluePrintInfo.OwningRepository?.IdRef ?? '',
                }))
            ),
            finalize(() => this._isPageTypesLoading.set(false)),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (mappedPageTypes: MappedPageType[]) => {
                this._pageTypes.set(mappedPageTypes);
            },
            error: (err) => {
                console.log("Failed to fetch page types", err);
                const errorMessage =
                    (err as { error?: { Message?: string } })?.error?.Message ||
                    (err as Error)?.message ||
                    'Unknown error';
                this.notificationService.error("Error", `Failed to load page types:${err?.error?.Message}`)
            },
            complete: () => {
                this._isPageTypesLoading.set(false)
            },
        })
    }

    setSelectedPageType(pagetype: MappedPageType) {
        this._selectedPageType.set(pagetype)
    }

    updateSelectedPageData(): Observable<PageStructure> {
        const pageId = this.selectedPageType()?.pageId;
        if (!pageId) {
            return throwError(() => new Error("No page type selected."));
        }

        this._isPageInfoLoading.set(true);
        this._pageInfoError.set(null);

        const sanitizedId = StringUtils.sanitizeIdentifier(pageId);

        return this.apiService.getItems<PageDataResponse>(`/items/${sanitizedId}?useDynamicVersion=true`).pipe(
            switchMap((pageResponse: PageDataResponse) => {
                const copyRequests: Observable<ItemActionResponse | null>[] = pageResponse.Regions.flatMap(region =>
                    region.ComponentPresentations.map((item: ComponentPresentationItem) => this.processComponentCopyWorkflow(item))
                );

                if (copyRequests.length === 0) {
                    return of(pageResponse);
                }

                return forkJoin(copyRequests).pipe(map(() => pageResponse));
            }),
            map((updatedPageResponse: PageDataResponse) => {
                const pageStructure = { ...this.defaultPageStructure() };
                pageStructure["Regions"] = updatedPageResponse.Regions;
                this._defaultPageStructure.set(pageStructure);
                return pageStructure;
            }),
            tap({
                next: (pageStructure) => {
                    this._isPageInfoLoading.set(false);
                    this._pageInfoError.set(null);
                },
                error: (err) => {
                    console.error("Error in page data update:", err);
                    this._isPageInfoLoading.set(false);
                    this._pageInfoError.set(err?.error?.Message || "Failed to update page structure.");
                    this.notificationService.error("Error", err?.error?.Message || "Failed to update page.")
                }
            })
        );
    }

    private processComponentCopyWorkflow(item: ComponentPresentationItem): Observable<ItemActionResponse | null> {
        const componentId = StringUtils.sanitizeIdentifier(item.Component.IdRef);

        return this.apiService.getItems<ComponentData>(`/items/${componentId}?useDynamicVersion=true`).pipe(
            // Copy component and pass forward componentData
            switchMap((componentData: ComponentData) => {
                const destinationFolderId = StringUtils.sanitizeIdentifier(componentData.LocationInfo.OrganizationalItem.IdRef);
                return this.apiService.postItem<ItemActionResponse>(`/items/${componentId}/copy/${destinationFolderId}`, { makeUnique: true })
                    .pipe(map((copyResponse: ItemActionResponse) => ({ componentData, copyResponse })));
            }),

            // Check out copied component
            switchMap(({ componentData, copyResponse }: { componentData: ComponentData; copyResponse: ItemActionResponse }) => {
                const copyComponentId = StringUtils.sanitizeIdentifier(copyResponse.Id);
                return this.apiService.postItem<ItemActionResponse>(`/items/${copyComponentId}/checkOut`, {})
                    .pipe(map((checkoutResponse:ItemActionResponse) => ({ componentData, checkoutResponse })));
            }),

            // Rename and update
            switchMap(({ componentData, checkoutResponse }: { componentData: ComponentData; checkoutResponse: ItemActionResponse }) => {
                const checkOutId = StringUtils.sanitizeIdentifier(checkoutResponse?.Id as string);
                const currentDate = new Date().toISOString();
                const componentTitle = `${this.formPageData()?.name}_${item.Component.Title}_${currentDate}`;

                item.Component.Title = componentTitle;
                checkoutResponse.Title = componentTitle;

                return this.apiService.updateItem<ItemActionResponse>(`/items/${checkOutId}`, checkoutResponse)
                    .pipe(map((updateResponse: ItemActionResponse) => ({ componentData, updateResponse })));
            }),

            // Check in
            switchMap(({ componentData, updateResponse }) => {
                const updatedComponentId = StringUtils.sanitizeIdentifier(updateResponse.Id);
                return this.apiService.checkin<ItemActionResponse, CheckInPayload>(`/items/${updatedComponentId}/checkIn`, {}).pipe(
                    map((checkinResponse: ItemActionResponse) => {
                        item.Component.IdRef = checkinResponse.Id;
                        return { componentData, checkinResponse };
                    })
                );
            }),

            // Promote component to owning publication
            switchMap(({ componentData, checkinResponse }) => {
                const owningRepositoryId = componentData.BluePrintInfo.OwningRepository.IdRef;
                const checkedInComponentId = StringUtils.sanitizeIdentifier(checkinResponse.Id)
                const promotiondata = {
                    DestinationRepositoryId: owningRepositoryId,
                    Instruction: {
                        "Mode": "FailOnError",
                        "Recursive": true
                    }
                }
                return this.apiService.postItem(`/items/${checkedInComponentId}/promote`, promotiondata)
                    .pipe(map(() => checkinResponse));
            }),

            catchError((err) => {
                console.error(`Failed to promote component ${componentId}`, err);
                return of(null);
            })
        );
    }

    updateFormData(formPageData: { name: string; filename: string; }) {
        this._formPageData.set(formPageData)
    }

    createPage<PageResponse>(): Observable<PageResponse> {
        const pageData = this.defaultPageStructure()
        return this.apiService.postItem(`/items?autoCheckIn=true`, pageData)
    }

    updateNewPageId(pageId: string) {
        this._createdPageId.set(pageId)
    }

    getOrganizationalItems(id: string) {
        const tcmid = StringUtils.sanitizeIdentifier(id)
        const url = `/items/${tcmid}/items?useDynamicVersion=true&rloItemTypes=StructureGroup&recursive=true&details=IdAndTitleOnly`
        this.apiService.getItems<StructureGroup[]>(url).subscribe(strGroup => {
            this._structureGroup.set(strGroup)
        })
    }

    getDefaultPageModel(structuregroupId: string):Observable<PageStructure> {
        return this.apiService.getItems<PageStructure>(`/item/defaultModel/Page?containerId=${encodeURIComponent(structuregroupId)}`)
            .pipe(
                tap((pageStructure:PageStructure) => {
                    const currentForm = this.formPageData();
                    const selectedType = this.selectedPageType();

                    pageStructure.IsPageTemplateInherited = false;
                    if (currentForm) {
                        pageStructure.Title = currentForm.name;
                        pageStructure.FileName = currentForm.filename;
                    }
                    if (selectedType) {
                        pageStructure.PageTemplate = {
                            $type: "Link",
                            IdRef: selectedType.pageTemplate?.templateId,
                            Title: selectedType.pageTemplate?.templateTitle
                        };
                        pageStructure.RegionSchema = {
                            $type: "Link",
                            IdRef: selectedType.pageSchema?.schemaId,
                            Title: selectedType.pageSchema?.schemaTitle
                        };
                        pageStructure.MetadataSchema = {
                            $type: "Link",
                            IdRef: selectedType.pageSchema?.schemaId,
                            Title: selectedType.pageSchema?.schemaTitle
                        }
                    }

                    this._defaultPageStructure.set(pageStructure);
                })
            );
    }

    geteFolderItems(selectedStrGroupId: string): Observable<FolderItem[]> {
        const tcmId = StringUtils.sanitizeIdentifier(selectedStrGroupId)
        return this.apiService.getItems(`/items/${tcmId}/items?useDynamicVersion=true&recursive=false&details=Contentless`)
    }
}