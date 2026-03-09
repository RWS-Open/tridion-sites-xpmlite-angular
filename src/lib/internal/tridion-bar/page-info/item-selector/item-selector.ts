import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from "@angular/core";
import { DatePipe, NgStyle } from "@angular/common";
import { map } from "rxjs";

import { XpmPageInfoService } from "../../../state/headless-xpm-page-info.service";

import { ComponentTemplateLinks } from "./item-selector.model";
import { PageData } from "../../../state/headless-xpm-page.model";
import { StringUtils } from "../../../utils/StringUtils";
import { OrganizationalTreeNode } from "./organizational-tree-node/organizational-tree-node";

@Component({
    selector: "app-item-selector",
    imports: [OrganizationalTreeNode, DatePipe, NgStyle],
    templateUrl: "./item-selector.html",
    styleUrl: './item-selector.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemSelector implements OnInit {

    private xpmPageInfoService = inject(XpmPageInfoService)

    componentTemplateLinks = signal<ComponentTemplateLinks[]>([])
    activeParentItem = signal<string>("")
    isOpen = signal<boolean>(false);
    isDropUp = signal(false);
    toggleConstraints = signal<boolean>(false)

    selectedComponentTemplate = signal<ComponentTemplateLinks | null>(null);
    selectedComponent = signal<ComponentTemplateLinks | null>(null)
    filterComponentTemplate = signal<ComponentTemplateLinks[]>([])

    organizationalItems = this.xpmPageInfoService.treeData;
    selectedRegionConstraints = computed(() => this.xpmPageInfoService.selectedRegionConstraints())
    organizationItemId = computed(() => StringUtils.sanitizeIdentifier(this.xpmPageInfoService.pageInfo()?.BluePrintInfo.OwningRepository.IdRef as string))
    publicationTitle = computed(() => this.xpmPageInfoService.pageInfo()?.LocationInfo.ContextRepository.Title)
    currentItem = computed(() => this.xpmPageInfoService.selectedNode()?.label)


    tableData = computed(() => {
        const selected = this.xpmPageInfoService.selectedNode();
        return selected ? (selected.children || []) : this.xpmPageInfoService.treeData();
    });
    isTableLoading = computed(() => {
        return this.xpmPageInfoService.selectedNode()?.isLoading
    });

    toggleItemSelector() {
        this.xpmPageInfoService.toggleModal()
    }

    updatePage() {
        const selectedRegionName = this.xpmPageInfoService.selectedPageitem()?.name;
        const selectedComponent = this.selectedComponent();
        const selectedComponentTemplate = this.selectedComponentTemplate();
        if (selectedRegionName && selectedComponent) {
            const pageData = this.xpmPageInfoService.pageInfo();
            const updateComponentPresentation = (regions: any[]) => {
                for (const region of regions) {
                    if (region.RegionName === selectedRegionName) {
                        region.ComponentPresentations.push({
                            $type: "ComponentPresentation",
                            Component: { $type: "Link", IdRef: selectedComponent.IdRef, Title: selectedComponent.Title },
                            ComponentTemplate: { $type: "Link", IdRef: selectedComponentTemplate?.IdRef, Title: selectedComponentTemplate?.Title },
                            Conditions: []
                        });
                        return true
                    }
                    if (region.Regions?.length > 0 && updateComponentPresentation(region.Regions)) {
                        return true
                    }
                }
                return false
            }
            if (pageData?.Regions) {
                updateComponentPresentation(pageData.Regions);
                this.xpmPageInfoService.updatePageInfo(pageData as PageData)

            }
        }
    }

    getComponentTemplateLinks(event: Event, componentId: string, componentTitle: string, schemaId: string) {
        const isChecked = (event.target as HTMLInputElement).checked;
        const regionConstraints = this.selectedRegionConstraints()
        if (isChecked && regionConstraints) {
            const id = StringUtils.sanitizeIdentifier(schemaId)
            this.selectedComponent.set({
                IdRef: componentId,
                Title: componentTitle
            })
            this.xpmPageInfoService.getComponentLinks(id).pipe(
                map(response => {
                    const allowedComponentTemplates = regionConstraints.map(c => c.BasedOnComponentTemplate?.IdRef).filter(Boolean);
                    return response.filter(item => allowedComponentTemplates.includes(item.IdRef))
                })
            ).subscribe(res => {
                if (res.length !== 0) {
                    this.componentTemplateLinks.set(res)
                    this.selectedComponentTemplate.set({
                        IdRef: res[0].IdRef,
                        Title: res[0].Title
                    })
                }
            })
        } else {
            this.componentTemplateLinks.set([]);
            this.selectedComponentTemplate.set(null)
            this.selectedComponent.set(null)
            this.isOpen.set(false);
        }
    }
    toggleDropdown(container: HTMLElement) {
        if (!this.isOpen()) {
            const rect = container.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = 200;

            this.isDropUp.set(spaceBelow < dropdownHeight);
        }
        this.isOpen.update(value => !value);
    }

    selectOption(option: { IdRef: string, Title: string }) {
        this.selectedComponentTemplate.set(option);
        this.isOpen.set(false);
    }
    showConstraint() {
        //if (this.regionConstraints.length) {
        this.toggleConstraints.update(value => !value)
        // this.selectedRegionConstraints.set(this.regionConstraints())
        //}
    }

    hideConstraints() {
        this.toggleConstraints.set(false)
    }
    ngOnInit(): void {
        const id = this.organizationItemId();
        if (id) {
            //this.xpmPageInfoService.getPageSchema();
            this.xpmPageInfoService.getOrganizationalItems(id as string).subscribe();
        }
    }
}