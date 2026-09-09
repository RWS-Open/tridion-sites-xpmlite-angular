import { inject, Injectable, signal } from "@angular/core";
import { catchError, forkJoin, map, of, switchMap, throwError } from "rxjs";
import { PageTypesProps } from "../tridion-bar/page-creation/page-types/page-types.model";
import { OrganizationalItemData } from "../tridion-bar/page-info/item-selector/item-selector.model";
import { StringUtils } from "../utils/StringUtils";
import { XpmApiService } from "./headless-xpm-api.service";
import { ComponentData } from "./headless-xpm-inline-editor.model";
import { XpmPageInfoService } from "./headless-xpm-page-info.service";
import { PageData } from "./headless-xpm-page.model";

@Injectable({
    providedIn: 'root'
})
export class HeadlessXpmPageCreationService {

    private readonly apiService = inject(XpmApiService)
    private readonly xpmPageInfoService = inject(XpmPageInfoService)

    private readonly _createdPageId = signal<string | null>(null)
    private readonly _isPageTypesLoading = signal<boolean>(false)
    private readonly _showPageCreationModal = signal<boolean>(false)
    private readonly _pageTypes = signal<PageTypesProps[]>([])
    private readonly _defaultPageStructure = signal<any>(null)
    private readonly _selectedPageType = signal<PageTypesProps | null>(null)
    private readonly _formPageData = signal<any>(null)
    private readonly _selectedPage = signal<any>(null)
    private readonly _isPageInfoLoading = signal<boolean>(false)
    private readonly _pageInfoError = signal<string | null>(null)

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

    togglePageCreationModal() {
        this._showPageCreationModal.set(!this.showPageCreationModal())
    }

    getPageTypes() {
        // Get Page Id
        const pageId = this.xpmPageInfoService.getPageId();
        if (!pageId) return;
        this._isPageTypesLoading.set(true)

        const escapedPageId = StringUtils.sanitizeIdentifier(pageId as string)
        const baseUrl = (id: string) => `/items/${StringUtils.sanitizeIdentifier(id)}/items?useDynamicVersion=true`;

        // Implementation for fetching page types
        this.apiService.getItems<PageData>(`/items/${escapedPageId}?useDynamicVersion=true`).pipe(
            // Get Organizational Item
            switchMap((response) => {
                console.log(response)
                const organizationalItemId = StringUtils.sanitizeIdentifier(response.BluePrintInfo.OwningRepository.IdRef)
                return this.apiService.getItems<OrganizationalItemData[]>(baseUrl(organizationalItemId))
            }),
            // Get Home Structure Group
            switchMap((structureGroups) => {
                const filteredStructureGroups = structureGroups.filter(item => item.$type === "StructureGroup")
                if (filteredStructureGroups.length === 0) {
                    return throwError(() => new Error("Structure Group 'Home' not found."));
                }

                const homeStructuregroupId = filteredStructureGroups.find((structureGroup) => structureGroup.Title === "Home")?.Id as string
                return this.apiService.getItems<OrganizationalItemData[]>(baseUrl(homeStructuregroupId)).pipe(
                    map(homeStructureGroupResponse => ({
                        homeStructuregroupId,
                        homeStructureGroupResponse
                    }))
                )
            }),
            switchMap(({ homeStructuregroupId, homeStructureGroupResponse }) => {

                return this.apiService.getItems<any>(`/item/defaultModel/Page?containerId=${homeStructuregroupId}`).pipe(

                    map((pageStructure) => {
                        //console.log("Default Page Structure:", pageStructure);
                        this._defaultPageStructure.set(pageStructure);
                        return homeStructureGroupResponse
                    }),
                )
            }),
            // Get Page Types
            switchMap((homeStructureGroupResponse: any[]) => {
                const pageTypesStructureGroupId = homeStructureGroupResponse.find(homeStructureGroup => homeStructureGroup.Title === "_Page Types")?.Id as string
                return this.apiService.getItems<any[]>(baseUrl(pageTypesStructureGroupId))
            })
        ).subscribe({
            next: (pageTypes: any) => {
                // console.log("Page Template:", pageTypes)
                this._pageTypes.set(pageTypes.map((template: any) => ({
                    pageId: template.Id,
                    pageTitle: template.Title,
                    pageSchema: {
                        schemaId: template.RegionSchema.IdRef,
                        schemaTitle: template.RegionSchema.Title,
                    },
                    pageTemplate: {
                        templateId: template.PageTemplate.IdRef,
                        templateTitle: template.PageTemplate.Title
                    }
                })))
            },
            error: (err) => console.log("Failed to fetch page types", err),
            complete: () => {
                this._isPageTypesLoading.set(false)
            },
        })
    }

    setSelectedPageType(pagetype: PageTypesProps) {
        this._selectedPageType.set(pagetype)
        //this.getSelectedPageData(pagetype.pageId)
    }

    updateSelectedPageData() {
        const pageId = this.selectedPageType()?.pageId as string
        console.log(pageId)
        this._isPageInfoLoading.set(true)
        this._pageInfoError.set(null)

        const sanitizedId = StringUtils.sanitizeIdentifier(pageId);
        this.apiService.getItems<PageData>(`/items/${sanitizedId}?useDynamicVersion=true`).pipe(
            switchMap((pageResponse) => {

                const copyRequests = pageResponse.Regions.flatMap(region => region.ComponentPresentations.map((item) => {
                    const componentId = StringUtils.sanitizeIdentifier(item.Component.IdRef);
                    return this.apiService.getItems<ComponentData>(`/items/${componentId}?useDynamicVersion=true`).pipe(
                        switchMap((componentData) => {
                            const destinationFolderId = StringUtils.sanitizeIdentifier(componentData.LocationInfo.OrganizationalItem.IdRef)
                            return this.apiService.postItem(`/items/${componentId}/copy/${destinationFolderId}`, {
                                makeUnique: true
                            })
                        }),
                        switchMap((copyResponse: any) => {
                            const copyComponentId = StringUtils.sanitizeIdentifier(copyResponse?.Id)
                            return this.apiService.postItem(`/items/${copyComponentId}/checkOut`, {})
                        }),
                        switchMap((checkoutResponse: any) => {
                            const checkOutId = StringUtils.sanitizeIdentifier(checkoutResponse?.Id)
                            const currentDate = new Date().toISOString()
                            const componentTitle = `${this.formPageData().name}_${item.Component.Title}_${currentDate}`
                            item.Component.Title = componentTitle
                            checkoutResponse.Title = componentTitle
                            return this.apiService.updateItem(`/items/${checkOutId}`, checkoutResponse)
                        }),
                        switchMap((updateResponse) => {
                            const updatedComponentId = StringUtils.sanitizeIdentifier(updateResponse?.Id);
                            return this.apiService.checkin(`/items/${updatedComponentId}/checkIn`, {}).pipe(
                                map((checkinResponse: any) => {
                                    item.Component.IdRef = checkinResponse?.Id;
                                    return checkinResponse
                                })
                            )
                        }),

                        catchError(err => {
                            console.error(`Failed to copy component ${componentId}`, err)
                            return of(null)
                        })
                    )
                }))
                if (copyRequests.length === 0) {
                    return of(pageResponse)
                }
                return forkJoin(copyRequests).pipe(
                    map(() => pageResponse)
                )
            })
        ).subscribe({
            next: (updatedPageResponse) => {
                const pageStructure = { ...this.defaultPageStructure() }
                pageStructure["Regions"] = updatedPageResponse.Regions;
                this._defaultPageStructure.set(pageStructure)
                console.log(`Final page Structure with Copied Components`, pageStructure)
            },
            complete: () => {
                this._isPageInfoLoading.set(false)
                this._pageInfoError.set(null)
            },
            error: (err) => {
                console.error("Error in page data:", err)
                this._isPageInfoLoading.set(false)
                this._pageInfoError.set(err.error.Message)
            }
        })
    }

    updateFormData(formPageData: {
        name: string;
        filename: string;
    }) {
        this._formPageData.set(formPageData)
        //console.log(formPageData)
        const pageStructure = { ...this.defaultPageStructure() }
        pageStructure["Title"] = formPageData.name;
        pageStructure["FileName"] = formPageData.filename;
        pageStructure["PageTemplate"] = {
            $type: "Link",
            IdRef: this.selectedPageType()?.pageTemplate.templateId,
            Title: this.selectedPageType()?.pageTemplate.templateTitle
        }
        pageStructure["RegionSchema"] = {
            $type: "Link",
            IdRef: this.selectedPageType()?.pageSchema.schemaId,
            Title: this.selectedPageType()?.pageSchema.schemaTitle
        }
        pageStructure["MetadataSchema"] = {
            $type: "Link",
            IdRef: this.selectedPageType()?.pageSchema.schemaId,
            Title: this.selectedPageType()?.pageSchema.schemaTitle
        }
        pageStructure["PrimaryBluePrintParentItem"] = {
            $type: "Link",
            IdRef: this.selectedPageType()?.pageId,
            Title: this.selectedPageType()?.pageTitle
        }
        pageStructure["IsPageTemplateInherited"] = false
        this._defaultPageStructure.set(pageStructure)
    }

    createPage() {
        const pageData = this.defaultPageStructure()
        return this.apiService.postItem(`/items?autoCheckIn=true`, pageData)
    }

    updateNewPageId(pageId: string) {
        this._createdPageId.set(pageId)
    }
}