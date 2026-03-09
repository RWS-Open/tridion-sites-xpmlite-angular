export interface PubishableTargets {
  '$type': string;
  Id: string;
  Title: string;
  ContentSecurityDescriptor: ContentSecurityDescriptor;
  Description: string;
  ExtensionProperties: ExtensionProperties;
  LoadInfo: LoadInfo;
  MinimalApprovalStatus: MinimalApprovalStatus;
  Priority: string;
  Purpose: string;
  SecurityDescriptor: ContentSecurityDescriptor;
}

interface MinimalApprovalStatus {
  '$type': string;
  IdRef: string;
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

interface ContentSecurityDescriptor {
  '$type': string;
  Permissions: string[];
  Rights: string[];
}

export interface ChildPublicationsProps {
  id: string;
  title: string
}

export interface ChildPublicationsData {
  '$type': string;
  Id: string;
  Title: string;
  AccessControlList: AccessControlList;
  BusinessProcessType: BusinessProcessType;
  ComponentSnapshotTemplate: BusinessProcessType;
  ComponentTemplateProcess: BusinessProcessType;
  ContentSecurityDescriptor: ContentSecurityDescriptor;
  DefaultComponentTemplate: BusinessProcessType;
  DefaultMultimediaSchema: BusinessProcessType;
  DefaultPageTemplate: BusinessProcessType;
  DefaultTemplateBuildingBlock: BusinessProcessType;
  ExtensionProperties: ExtensionProperties;
  HasChildren: boolean;
  IsEditable: boolean;
  Key: string;
  LoadInfo: LoadInfo;
  Locale: string;
  LocationInfo: LocationInfo;
  Metadata: Metadata;
  MetadataSchema: BusinessProcessType;
  MinimalLocalizeApprovalStatus: BusinessProcessType;
  MultimediaPath: string;
  MultimediaUrl: string;
  PageSnapshotTemplate: OrganizationalItem;
  PageTemplateProcess: BusinessProcessType;
  Parents: BusinessProcessType[];
  PublicationPath: string;
  PublicationType: string;
  PublicationUrl: string;
  RootFolder: BusinessProcessType;
  RootStructureGroup: BusinessProcessType;
  SecurityDescriptor: ContentSecurityDescriptor;
  ShareProcessAssociations: boolean;
  TaskProcess: BusinessProcessType;
  TemplateBundleProcess: BusinessProcessType;
  VersionInfo: VersionInfo;
}

interface VersionInfo {
  '$type': string;
  CreationDate: string;
  Creator: Trustee;
  RevisionDate: string;
}

interface Metadata {
  '$type': string;
  siteId: string;
  isMaster: string[] | null;
}

interface LocationInfo {
  '$type': string;
  ContextRepository: BusinessProcessType;
  OrganizationalItem: OrganizationalItem;
  Path: string;
  WebDavUrl: string;
}

interface OrganizationalItem {
  '$type': string;
  IdRef: string;
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

interface ContentSecurityDescriptor {
  '$type': string;
  Permissions: string[];
  Rights: string[];
}

interface BusinessProcessType {
  '$type': string;
  IdRef: string;
  Title: string;
}

interface AccessControlList {
  '$type': string;
  AccessControlEntries: AccessControlEntry[];
}

interface AccessControlEntry {
  '$type': string;
  AllowedPermissions: string[];
  AllowedRights: string[];
  DeniedPermissions: string[];
  DeniedRights: string[];
  Trustee: Trustee;
}

interface Trustee {
  '$type': string;
  IdRef: string;
  Title: string;
  Description: string;
}

export interface PublishModalTabs{
  title:string
  id:number
}