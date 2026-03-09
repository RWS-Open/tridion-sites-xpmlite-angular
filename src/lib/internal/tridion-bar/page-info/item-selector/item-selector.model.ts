export interface TreeNode {
  '$type': string;
  id: string;
  label: string;
  schema:string;
  schemaId:string;
  status:boolean;
  date_modified:string;
  hasChildren?: boolean; 
  children?: TreeNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
}

export interface OrganizationalItemData {
  '$type': string;
  Id: string;
  Title: string;
  AccessControlList: AccessControlList;
  ApplicableActions: ApplicableAction[];
  BluePrintInfo: BluePrintInfo;
  ContentSecurityDescriptor: ContentSecurityDescriptor;
  ExtensionProperties: ExtensionProperties;
  IsActive: boolean;
  IsActiveResolvedValue: boolean;
  IsEditable: boolean;
  IsLinkedSchemaMandatory: boolean;
  IsPermissionsInheritanceRoot: boolean;
  IsPublishedInContext: boolean;
  IsRootOrganizationalItem: boolean;
  LinkedSchema: OwningRepository;
  Schema: OwningRepository;
  ListLinks: ApplicableAction[];
  LoadInfo: LoadInfo;
  Locale: string;
  LocationInfo: LocationInfo;
  LockInfo: LockInfo;
  MetadataSchema: OwningRepository;
  SecurityDescriptor: ContentSecurityDescriptor;
  VersionInfo: VersionInfo;
}

interface VersionInfo {
  '$type': string;
  CreationDate: string;
  Creator: Trustee;
  RevisionDate: string;
}

interface LockInfo {
  '$type': string;
  LockType: string[];
  LockUser: Trustee;
}

interface LocationInfo {
  '$type': string;
  ContextRepository: OwningRepository;
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

export interface ComponentTemplateLinks {
  IdRef: string;
  Title: string;
}
