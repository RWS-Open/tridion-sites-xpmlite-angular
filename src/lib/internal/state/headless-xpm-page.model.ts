export interface AuthConfig {
    clientId: string;
    issuer: string;
    redirectUri: string;
    scope: string;
}

export interface AuthResponse {
    access_token: string;
    expires_in: number;
    id_token: string;
    refresh_token: string;
    scope: string;
    token_type: string
}

export enum AUTH_TOKEN_KEY{
    TOKEN_KEY = "xpmAuthToken",
    RETURN_URL = "xpmReturnUrl",
    AUTH_VERIFIER = "xpmAuthVerifier"
}

export interface PageData {
  '$type': string;
  Id: string;
  Title: string;
  ApplicableActions: ApplicableAction[];
  ApprovalStatus: ApprovalStatus;
  BluePrintInfo: BluePrintInfo;
  ComponentPresentations: any[];
  ExtensionProperties: ExtensionProperties;
  FileName: string;
  IsEditable: boolean;
  IsPageTemplateInherited: boolean;
  IsPublishedInContext: boolean;
  ListLinks: ApplicableAction[];
  LoadInfo: LoadInfo;
  Locale: string;
  LocationInfo: LocationInfo;
  LockInfo: LockInfo;
  Metadata: ExtensionProperties;
  MetadataSchema: ApprovalStatus;
  PageTemplate: ApprovalStatus;
  Regions: Region2[];
  RegionSchema: ApprovalStatus;
  SecurityDescriptor: SecurityDescriptor;
  VersionInfo: VersionInfo;
  WorkflowInfo: WorkflowInfo;
}

interface WorkflowInfo {
  '$type': string;
  ActivityConstraints: string;
  ActivityDefinitionDescription: string;
  ActivityInstance: ApprovalStatus;
  Assignee: LockUser;
  Performer: LockUser;
  PreviousMessage: string;
  ProcessInstance: ApprovalStatus;
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

export interface Region2 {
  '$type': string;
  ComponentPresentations: ComponentPresentation[];
  Metadata: Metadata;
  RegionName: string;
  Regions: Region[];
  RegionSchema: ApprovalStatus;
}

export interface Region {
  '$type': string;
  ComponentPresentations: any[];
  Metadata: ExtensionProperties;
  RegionName: string;
  Regions: any[];
  RegionSchema: ApprovalStatus;
}

interface Metadata {
  '$type': string;
  maxItems?: null;
}

interface ComponentPresentation {
  '$type': string;
  Component: ApprovalStatus;
  ComponentTemplate: ApprovalStatus;
  Conditions: any[];
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
  ContextRepository: ApprovalStatus;
  OrganizationalItem: ApprovalStatus;
  Path: string;
  PublishLocationPath: string;
  PublishLocationUrl: string;
  PublishPath: string;
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
  OwningRepository: ApprovalStatus;
  PrimaryBluePrintParentItem: ApprovalStatus;
}

interface ApprovalStatus {
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