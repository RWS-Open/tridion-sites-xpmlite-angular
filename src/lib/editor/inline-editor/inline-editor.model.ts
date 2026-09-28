import {
  ApplicableAction,
  ApprovalStatus,
  BluePrintInfo,
  DynamicVersionInfo,
  ExtensionProperties,
  LoadInfo,
  LocationInfo,
  LockInfo,
  Metadata,
  SecurityDescriptor,
  VersionInfo,
  WorkflowInfo
} from '../../internal/state/headless-xpm-common.model';

export interface CheckoutData {
  '$type': string;
  Id: string;
  Title: string;
  ApplicableActions: ApplicableAction[];
  ApprovalStatus: ApprovalStatus;
  BluePrintInfo: BluePrintInfo;
  ComponentType: string;
  Content: CheckoutContent;
  DynamicVersionInfo: DynamicVersionInfo;
  ExtensionProperties: ExtensionProperties;
  IsBasedOnMandatorySchema: boolean;
  IsBasedOnTridionWebSchema: boolean;
  IsEditable: boolean;
  IsPublishedInContext: boolean;
  ListLinks: ApplicableAction[];
  LoadInfo: LoadInfo;
  Locale: string;
  LocationInfo: LocationInfo;
  LockInfo: LockInfo;
  Metadata: Metadata;
  MetadataSchema: ApprovalStatus;
  Schema: ApprovalStatus;
  SecurityDescriptor: SecurityDescriptor;
  VersionInfo: VersionInfo;
  WorkflowInfo: WorkflowInfo;
}

export interface CheckoutContent {
  '$type': string;
  headline?: string;
  [key: string]: unknown;
}

export interface TridionItemRef {
  $type?: string;
  IdRef: string;
  Title?: string;
}

export interface ComponentBluePrintInfo {
  PrimaryBluePrintParentItem: TridionItemRef;
  [key: string]: unknown;
}

export interface ComponentItem {
  Id: string;
  Title?: string;
  BluePrintInfo: ComponentBluePrintInfo;
  [key: string]: unknown;
}

export interface CheckInPayload {
  RemovePermanentLock: boolean;
}

export interface CheckInResponse {
  Id: string;
  [key: string]: unknown;
}