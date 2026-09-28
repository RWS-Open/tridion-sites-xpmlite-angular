export interface BluePrintInfo{
    $type: string;
    IsLocalized: boolean;
    IsShared:boolean;
    OwningRepository:OwningRepository
}
interface OwningRepository{
    $type: string;
    IdRef: string;
    Title: string;
}
export interface PageSchema {
    schemaId: string;
    schemaTitle: string;
}

export interface PageTemplate {
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

export interface StructureGroup{
    $type: string,
    Id: string,
    Title: string,
    ExtensionProperties: {
      $type: string
    }
}

export interface SelectedStructureGroup{
     Id: string; 
     Title: string 
}