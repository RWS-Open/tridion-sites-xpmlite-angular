export interface PageTypesProps {
    pageId: string;
    pageTitle: string;
    pageSchema: PageSchema;
    pageTemplate: PageTemplate;
    //regions?: PageRegion[];
}

interface PageSchema {
    schemaId: string;
    schemaTitle: string;
}

interface PageTemplate {
    templateId: string;
    templateTitle: string;
}


interface PageRegion {
    $type: string;
    ComponentPresentations: ComponentPresentations[];
    RegionName: string;
    RegionSchema: FieldValues;
    Regions: PageRegion[]; // For nested regions
    Metadata: {
        $type: string;
    }
}

interface ComponentPresentations {
    $type: string;
    component: FieldValues,
    componentTemplate: FieldValues,
    Conditions: any[];
}

interface FieldValues {
    $type: string;
    IdRef: string;
    Title: string;
}