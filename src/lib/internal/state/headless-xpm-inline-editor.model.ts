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
  VersionInfo,
  WorkflowInfo
} from './headless-xpm-common.model';

export interface ComponentData {
  '$type': string;
  Id: string;
  Title: string;
  ApplicableActions: ApplicableAction[];
  ApprovalStatus: ApprovalStatus;
  BluePrintInfo: BluePrintInfo;
  ComponentType: string;
  Content: Content;
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

interface Content {
  '$type': string;
  headline: string;
  itemListElement?: ItemListElement[];
}

interface ItemListElement {
  '$type': string;
  subheading: string;
  content: unknown;
  media: ApprovalStatus;
  link: Link;
}

interface Link {
  '$type': string;
  linkText: string;
  externalLink: string;
  internalLink: unknown;
  alternateText: string;
}