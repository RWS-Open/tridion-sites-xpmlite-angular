import { DOCUMENT, effect, inject, Injectable, signal } from "@angular/core";
import { concatMap, map, shareReplay, tap } from "rxjs";

import { ComponentTemplateLinks, OrganizationalItemData, TreeNode } from "../tridion-bar/page-info/item-selector/item-selector.model";
import { ComponentPresentationConstraint, NestedRegion2, PageSchema } from "./headless-xpm-page-schema.model";
import { SelectedPageItem } from "./headless-xpm-publications.model";
import { PageData, Region, Region2 } from "./headless-xpm-page.model";

import { XpmApiService } from "./headless-xpm-api.service";
import { AuthService } from "./headless-xpm-auth.service";
import { StringUtils } from "../utils/StringUtils";
import { XpmHighlighter } from "./headless-xpm-highlighter";

@Injectable({
    providedIn: "root"
})

export class XpmPageInfoService {
    private document = inject(DOCUMENT);
    private readonly apiService = inject(XpmApiService)
    private readonly authService = inject(AuthService)
    private readonly highlighterService = inject(XpmHighlighter)

    private readonly _showPageInfo = signal<boolean>(false)
    private readonly _pageInfo = signal<PageData | null>(null)
    private readonly _pageSchema = signal<PageSchema | null>(null)
    private readonly _organizationalData = signal<OrganizationalItemData[] | null>(null)
    private readonly _showModal = signal<boolean>(false)
    private readonly _selectedPageItem = signal<SelectedPageItem | null>(null)
    private readonly _selectedRegionConstraints = signal<ComponentPresentationConstraint[]>([])
    private readonly _treeData = signal<TreeNode[]>([]);
    private readonly _selectedNode = signal<TreeNode | null>(null);
    private readonly _pageId = signal<string | null>(null)
    isLoading = signal<boolean>(false)
    isPageUpdating = signal<boolean>(false)

    readonly showPageInfo = this._showPageInfo.asReadonly()
    readonly pageId = this._pageId.asReadonly()
    readonly pageInfo = this._pageInfo.asReadonly()
    readonly pageSchema = this._pageSchema.asReadonly()
    readonly organizationalData = this._organizationalData.asReadonly()
    readonly treeData = this._treeData.asReadonly();
    readonly selectedNode = this._selectedNode.asReadonly();
    readonly showModal = this._showModal.asReadonly();
    readonly selectedPageitem = this._selectedPageItem.asReadonly();
    readonly selectedRegionConstraints = this._selectedRegionConstraints.asReadonly()

    toggleModal() {
        this._showModal.set(!this._showModal())
    }

    getPageInfo(pageId: string) {
        this.isLoading.set(true)
        const pageTcmId = StringUtils.sanitizeIdentifier(pageId)
        const url = `/items/${pageTcmId}?useDynamicVersion=true`;

        this.apiService.getItems<PageData>(url).subscribe((res) => {
            this._pageInfo.set(res)
            this.isLoading.set(false)
        })
    }

    pageInfoLoaded(pageId: string){
        this.isLoading.set(true)
        const pageTcmId = StringUtils.sanitizeIdentifier(pageId)
        const url = `/items/${pageTcmId}?useDynamicVersion=true`;

       return this.apiService.getItems<PageData>(url)
    }

    getOrganizationalItems(orgItemId: string) {
        const url = `/items/${orgItemId}/items?useDynamicVersion=false&recursive=false&details=Contentless`
        return this.apiService.getItems<OrganizationalItemData[]>(url).pipe(
            map(response => {

                return response.filter(item => item.$type === "Folder" || item.$type === "Component")
            }),
            tap((filteredData) => {
                const rootId = StringUtils.sanitizeIdentifier(this.pageInfo()?.BluePrintInfo.OwningRepository.IdRef as string)
                if (orgItemId === rootId) {
                    const mappedNodes = filteredData.map(item => ({
                        $type: item.$type,
                        id: item.Id,
                        label: item.Title,
                        schema: item.LinkedSchema ? item.LinkedSchema.Title : (item.Schema ? item.Schema.Title : ""),
                        schemaId: item.LinkedSchema ? item.LinkedSchema.IdRef : (item.Schema ? item.Schema.IdRef : ""),
                        date_modified: item.VersionInfo?.RevisionDate,
                        status: item.IsPublishedInContext,
                        hasChildren: true,
                        children: [],
                        expanded: false,
                        loading: false
                    }));
                    this._organizationalData.set(filteredData)
                    this._treeData.set(mappedNodes);
                }
            })
        )
    }

    updateNodeChildren(parentId: string, children: TreeNode[]) {
        this._treeData.update(oldTree => {
            const newTree = JSON.parse(JSON.stringify(oldTree)); // Deep clone to trigger reactivity
            const parent = this.findNodeById(newTree, parentId);
            if (parent) {
                parent.children = children;
                parent.isLoading = false;
            }
            return newTree;
        });
    }

    private findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = this.findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    loadAndSelectNode(node: TreeNode) {
        this._selectedNode.set(node);

        if (!node.children || node.children.length === 0) {
            node.isLoading = true;
            const id = StringUtils.sanitizeIdentifier(node.id)
            this.getOrganizationalItems(id).subscribe((items) => {
                const mapped = items.map(item => ({
                    $type: item.$type,
                    id: item.Id,
                    label: item.Title,
                    schema: item.LinkedSchema ? item.LinkedSchema.Title : (item.Schema ? item.Schema.Title : ""),
                    schemaId: item.LinkedSchema ? item.LinkedSchema.IdRef : (item.Schema ? item.Schema.IdRef : ""),
                    status: item.IsPublishedInContext,
                    date_modified: item.VersionInfo?.RevisionDate,
                    hasChildren: true,
                    children: [],
                    expanded: false,
                    loading: false
                }));

                node.children = mapped;
                node.isLoading = false;

                this._selectedNode.set({ ...node });
            });
        }
    }

    getComponentLinks(schemaId: string) {
        const url = `/items/${schemaId}/componentTemplateLinks?onlyAllowedOnPage=true`
        return this.apiService.getItems<ComponentTemplateLinks[]>(url).pipe(
            map(response => response.map(item => ({
                IdRef: item.IdRef,
                Title: item.Title
            })))
        )
    }

    setSelectedPageItem({ name, type, id, position }: SelectedPageItem) {
        this._selectedPageItem.set({
            name: name,
            type: type,
            id: id,
            position: position
        })
        if (type === "EmbeddedRegion") {
            const element = `[data-region="${name}"]`;
            this.highlighterService.findScrollHightLightArea(element)
        } else if (type === "ComponentPresentation") {
            const element = `[data-component="${name}"]`;
            this.highlighterService.findScrollHightLightArea(element)
        } else if (type === "Page") {
            const element = `[data-page="${id}"]`;
            this.highlighterService.findScrollHightLightArea(element)
        }
    }

    updatePageInfo(pageData: PageData) {
        this._pageInfo.set(pageData)
    }

    savePageInfo() {
        const body = this._pageInfo();
        if (!body) return;
        this.isPageUpdating.set(true)
        this.checkoutPage().pipe(
            concatMap((checkoutRes: any) => {
                body.Id = checkoutRes.Id;
                const checkoutId = StringUtils.sanitizeIdentifier(checkoutRes.Id)
                const url = `/items/${checkoutId}`;
                return this.apiService.updateItem(url, body);
            }),
            concatMap((updateRes: any) => {
                const id = StringUtils.sanitizeIdentifier(updateRes?.Id)
                const checkInUrl = `/items/${id}/checkIn`;
                const checkInBody = { "RemovePermanentLock": true };

                return this.apiService.checkin(checkInUrl, checkInBody);
            })
        ).subscribe({
            next: (updateResponse) => {
                // console.log("Page saved and checked in successfully", updateResponse);
                this.isPageUpdating.set(false)
            },
            error: (err) => {
                this.isPageUpdating.set(false)
                console.error("Error during save sequence", err);
            }
        });
    }

    checkoutPage() {
        const pageTcmId = StringUtils.sanitizeIdentifier(this.pageId() as string)
        const url = `/items/${pageTcmId}/checkOut`
        return this.apiService.checkOutItem(url, {})
    }

    deleteComponentPresenetationItem() {
        const selectedId = this.selectedPageitem()?.id;
        const position = this.selectedPageitem()?.position
        if (!selectedId || position === undefined) return;

        this._pageInfo.update(state => {
            if (!state) return state;

            const processRegions = (regions: Region2[]): any => {
                return regions.map((region: Region) => {
                    const updatedCps = region.ComponentPresentations?.filter((item, index) => !(item.Component.IdRef === selectedId && index === position))
                    const updateNestedRegions = region.Regions ? processRegions(region.Regions) : region.Regions
                    return {
                        ...region,
                        ComponentPresentations: updatedCps,
                        Regions: updateNestedRegions
                    };
                });
            };
            return {
                ...state,
                Regions: processRegions(state.Regions as Region2[])
            };
        });
    }

    getPageSchema() {
        const pageSchemaId = StringUtils.sanitizeIdentifier(this.pageInfo()?.RegionSchema.IdRef as string)
        const url = `/items/${pageSchemaId}?useDynamicVersion=false`;
        const regionName = this.selectedPageitem()?.name;
        this.apiService.getItems<PageSchema>(url).subscribe(res => {
            this._pageSchema.set(res)
            // const regionConstraints = res?.RegionDefinition?.NestedRegions?.find(region => region.RegionName === this.selectedPageitem()?.name)?.RegionSchema?.ExpandedData?.RegionDefinition?.ComponentPresentationConstraints ?? [];
            const regionConstraints = regionName && res.RegionDefinition.NestedRegions ? this.getConstraints(res.RegionDefinition.NestedRegions, regionName) : []
            // this.getConstraints(constraints, regionName as string)
            this._selectedRegionConstraints.set(regionConstraints)
        })
    }

    getConstraints(regions: NestedRegion2[], regionName: string) {
        for (const region of regions) {
            if (region.RegionName === regionName) {
                return region.RegionSchema.ExpandedData.RegionDefinition.ComponentPresentationConstraints
            }
            const nestedRegion = region.RegionSchema.ExpandedData.RegionDefinition.NestedRegions
            if (nestedRegion && nestedRegion.length > 0) {
                const foundRegion: any = this.getConstraints(nestedRegion, regionName)
                if (foundRegion.length > 0) {
                    return foundRegion
                }
            }
        }
        return []
    }

    togglePageInfo(showPageInfo: boolean) {
        this._showPageInfo.set(showPageInfo)
    }

    getPageId(): string | null {
        const pageId = this.document.querySelector('[data-page]')?.getAttribute('data-page') ?? null;
        this.updatePageId(pageId as string)
        return pageId
    }

    clearState() {
        this._pageInfo.set(null)
        this._organizationalData.set(null)
        this._showModal.set(false)
        this._selectedPageItem.set(null)
    }
    updatePageId(value: string): void {
        this._pageId.set(value)
    }
    constructor() {
        effect(() => {
            if (!this.authService.isAuthenticated()) {
                this.clearState();
            }
        });
    }
}