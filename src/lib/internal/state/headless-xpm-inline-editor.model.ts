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

interface Metadata {
  '$type': string;
  standardMeta: null;
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

interface Content {
  '$type': string;
  headline: string;
  itemListElement: ItemListElement[];
}

interface ItemListElement {
  '$type': string;
  subheading: string;
  content: null;
  media: ApprovalStatus;
  link: Link;
}

interface Link {
  '$type': string;
  linkText: string;
  externalLink: string;
  internalLink: null;
  alternateText: string;
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