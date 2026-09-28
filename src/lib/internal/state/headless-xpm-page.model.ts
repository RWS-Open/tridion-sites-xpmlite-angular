import {
  ApplicableAction,
  ApprovalStatus,
  BluePrintInfo,
  ExtensionProperties,
  LoadInfo,
  LocationInfo,
  LockInfo,
  Metadata,
  SecurityDescriptor,
  UserRef,
  VersionInfo,
  WorkflowInfo
} from './headless-xpm-common.model';

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
  ComponentPresentations: ComponentPresentation[];
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
  Metadata: Metadata;
  MetadataSchema: ApprovalStatus;
  PageTemplate: ApprovalStatus;
  Regions: Region[];
  RegionSchema: ApprovalStatus;
  SecurityDescriptor: SecurityDescriptor;
  VersionInfo: VersionInfo;
  WorkflowInfo: WorkflowInfo;
}

export interface Region {
  '$type': string;
  ComponentPresentations: ComponentPresentation[];
  Metadata: Metadata;
  RegionName: string;
  Regions: Region[];
  RegionSchema: ApprovalStatus;
}

interface ComponentPresentation {
  '$type': string;
  Component: ApprovalStatus;
  ComponentTemplate: ApprovalStatus;
  Conditions: unknown[];
}