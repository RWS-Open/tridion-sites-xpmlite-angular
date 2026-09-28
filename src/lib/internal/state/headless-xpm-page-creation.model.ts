import { TridionItemRef } from "./headless-xpm-common.model";
import { Region } from "./headless-xpm-page.model";

export interface ItemReference {
    IdRef: string;
    Title?: string;
    [key: string]: unknown;
}

export interface TridionItemReference {
    $type?: string;
    IdRef: string;
    Title?: string;
}

export interface BluePrintInfo {
    OwningRepository?: ItemReference;
    Repository?: ItemReference;
    IdRef?: string;
    [key: string]: unknown;
}

export interface PageStructure {
    Id?: string;
    Title?: string;
    FileName?: string;
    IsPageTemplateInherited?: boolean;
    PageTemplate?: TridionItemRef;
    RegionSchema?: TridionItemRef;
    MetadataSchema?: TridionItemRef;
    PrimaryBluePrintParentItem?: TridionItemRef;
    Regions?: Region[];
    [key: string]: unknown;
}

export interface ComponentData {
    Id: string;
    Title: string;
    LocationInfo: {
        OrganizationalItem: TridionItemReference;
    };
    BluePrintInfo?: {
        OwningRepository: TridionItemReference;
    };
    [key: string]: unknown;
}

export interface ItemActionResponse {
    Id: string;
    Title: string;
    [key: string]: unknown;
}

export interface ComponentPresentationItem {
    Component: {
        IdRef: string;
        Title: string;
    };
    ComponentTemplate?: TridionItemReference;
}

export interface PageRegion {
    ComponentPresentations: ComponentPresentationItem[];
    [key: string]: unknown;
}

export interface PageDataResponse {
    Id: string;
    Title: string;
    FileName: string;
    Regions: Region[];
    [key: string]: unknown;
}

export interface PageSchema {
    schemaId: string;
    schemaTitle: string;
}

export interface PageTemplate {
    templateId: string;
    templateTitle: string;
}

// Single declaration of PageTypeRawItem
export interface PageTypeRawItem {
    Id: string;
    Title: string;
    RegionSchema: ItemReference;
    PageTemplate: ItemReference;
    BluePrintInfo: BluePrintInfo;
    [key: string]: unknown;
}

export interface MappedPageType {
    pageId: string;
    pageTitle: string;
    pageSchema: PageSchema;
    pageTemplate: PageTemplate;
    publicationId: string;
}