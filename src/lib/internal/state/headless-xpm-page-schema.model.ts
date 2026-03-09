export interface PageSchema {
  '$type': string;
  Id: string;
  Title: string;
  AllowedMultimediaTypes: any[];
  ApplicableActions: ApplicableAction[];
  BluePrintInfo: BluePrintInfo;
  BundleProcess: OwningRepository;
  ComponentProcess: OwningRepository;
  DeleteBundleOnProcessFinished: boolean;
  Description: string;
  ExtensionProperties: ExtensionProperties;
  Fields: ExtensionProperties;
  IsEditable: boolean;
  IsIndexable: boolean;
  IsPublishable: boolean;
  IsPublishedInContext: boolean;
  IsTridionWebSchema: boolean;
  ListLinks: ApplicableAction[];
  LoadInfo: LoadInfo;
  Locale: string;
  LocationInfo: LocationInfo;
  LockInfo: LockInfo;
  Metadata: ExtensionProperties;
  MetadataFields: MetadataFields;
  MetadataSchema: OwningRepository;
  NamespaceUri: string;
  Purpose: string;
  RegionDefinition: RegionDefinition3;
  RootElementName: string;
  SecurityDescriptor: SecurityDescriptor;
  VersionInfo: VersionInfo;
}

interface VersionInfo {
  '$type': string;
  CheckOutUser: LockUser;
  CreationDate: string;
  Creator: LockUser;
  IsNew: boolean;
  LastVersion: number;
  LockType: string[];
  Revision: number;
  RevisionDate: string;
  Revisor: LockUser;
  SystemComment: string;
  UserComment: string;
  Version: number;
}

interface SecurityDescriptor {
  '$type': string;
  Permissions: string[];
  Rights: string[];
}

interface RegionDefinition3 {
  '$type': string;
  ComponentPresentationConstraints: any[];
  DefaultComponentPresentations: any[];
  IsLocalizable: boolean;
  NestedRegions: NestedRegion2[];
}

export interface NestedRegion2 {
  '$type': string;
  IsMandatory: boolean;
  RegionName: string;
  RegionSchema: RegionSchema2;
}

interface RegionSchema2 {
  '$type': string;
  IdRef: string;
  Title: string;
  ExpandedData: ExpandedData2;
}

interface ExpandedData2 {
  '$type': string;
  Id: string;
  Title: string;
  Description: string;
  ExtensionProperties: ExtensionProperties;
  Fields: ExtensionProperties;
  MetadataFields: MetadataFields2;
  NamespaceUri: string;
  Purpose: string;
  RegionDefinition: RegionDefinition2;
  RootElementName: string;
}

interface RegionDefinition2 {
  '$type': string;
  ComponentPresentationConstraints: ComponentPresentationConstraint[];
  DefaultComponentPresentations: any[];
  IsLocalizable: boolean;
  NestedRegions: NestedRegion[];
}

interface NestedRegion {
  '$type': string;
  IsMandatory: boolean;
  RegionName: string;
  RegionSchema: RegionSchema;
}

interface RegionSchema {
  '$type': string;
  IdRef: string;
  Title: string;
  ExpandedData: ExpandedData;
}

interface ExpandedData {
  '$type': string;
  Id: string;
  Title: string;
  Description: string;
  ExtensionProperties: ExtensionProperties;
  Fields: ExtensionProperties;
  MetadataFields: ExtensionProperties;
  NamespaceUri: string;
  Purpose: string;
  RegionDefinition: RegionDefinition;
  RootElementName: string;
}

interface RegionDefinition {
  '$type': string;
  ComponentPresentationConstraints: ComponentPresentationConstraint[];
  DefaultComponentPresentations: any[];
  IsLocalizable: boolean;
  NestedRegions: any[];
}

export interface ComponentPresentationConstraint {
  '$type': string;
  MaxOccurs?: number;
  MinOccurs?: number;
  BasedOnComponentTemplate?: OwningRepository;
  BasedOnSchema?: OwningRepository;
}

interface MetadataFields2 {
  '$type': string;
  maxItems?: MaxItems;
}

interface MaxItems {
  '$type': string;
  Description: string;
  ExtensionXml: string;
  IsIndexable: boolean;
  IsLocalizable: boolean;
  IsPublishable: boolean;
  MaxOccurs: number;
  MinOccurs: number;
  Name: string;
  UseForAutoClassification: boolean;
}

interface MetadataFields {
  '$type': string;
  sitemapKeyword: SitemapKeyword;
  seoKeywords: SeoKeywords;
  seoDescription: SeoKeywords;
}

interface SeoKeywords {
  '$type': string;
  Description: string;
  ExtensionXml: string;
  Height: number;
  IsIndexable: boolean;
  IsLocalizable: boolean;
  IsPublishable: boolean;
  MaxOccurs: number;
  MinOccurs: number;
  Name: string;
  UseForAutoClassification: boolean;
}

interface SitemapKeyword {
  '$type': string;
  AllowAutoClassification: boolean;
  Category: OwningRepository;
  Description: string;
  ExtensionXml: string;
  IsIndexable: boolean;
  IsLocalizable: boolean;
  IsPublishable: boolean;
  List: List;
  MaxOccurs: number;
  MinOccurs: number;
  Name: string;
}

interface List {
  '$type': string;
  Height: number;
  Type: string;
}

interface LockInfo {
  '$type': string;
  LockType: string[];
  LockUser: LockUser;
}

interface LockUser {
  '$type': string;
  IdRef: string;
  Title: string;
  Description: string;
}

interface LocationInfo {
  '$type': string;
  ContextRepository: OwningRepository;
  OrganizationalItem: OwningRepository;
  Path: string;
  WebDavUrl: string;
}

interface LoadInfo {
  '$type': string;
  ErrorMessage: string;
  ErrorType: string;
  State: string;
}

interface ExtensionProperties {
  '$type': string;
}

interface BluePrintInfo {
  '$type': string;
  IsLocalized: boolean;
  IsShared: boolean;
  OwningRepository: OwningRepository;
  PrimaryBluePrintParentItem: OwningRepository;
}

interface OwningRepository {
  '$type': string;
  IdRef: string;
  Title: string;
}

interface ApplicableAction {
  '$type': string;
  Href: string;
  Rel: string;
  Type: string;
}