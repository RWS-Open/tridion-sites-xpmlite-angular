export interface PublicationList {
  '$type': string;
  Id: string;
  Title: string;
  AccessControlList: AccessControlList;
  ApplicableActions: ApplicableAction[];
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
  ListLinks: ApplicableAction[];
  LoadInfo: LoadInfo;
  Locale: string;
  LocationInfo: LocationInfo;
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

interface ApplicableAction {
  '$type': string;
  Href: string;
  Rel: string;
  Type: string;
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

export interface SelectedPageItem {
    type: string,
    name: string;
    id:string;
    position:number
}