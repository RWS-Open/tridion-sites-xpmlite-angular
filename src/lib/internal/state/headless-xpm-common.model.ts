// Common types shared across the library

export interface TridionItemRef {
  $type?: string;
  IdRef: string;
  Title?: string;
  Description?: string;
}

export interface ApprovalStatus {
  $type: string;
  IdRef: string;
  Title: string;
}

export interface ApplicableAction {
  $type: string;
  Href: string;
  Rel: string;
  Type: string;
}

export interface UserRef {
  $type: string;
  IdRef: string;
  Title: string;
  Description: string;
}

export interface BluePrintInfo {
  $type: string;
  IsLocalized: boolean;
  IsShared: boolean;
  OwningRepository: ApprovalStatus;
  PrimaryBluePrintParentItem?: ApprovalStatus;
}

export interface WorkflowInfo {
  $type: string;
  ActivityConstraints: string;
  ActivityDefinitionDescription: string;
  ActivityInstance: ApprovalStatus;
  Assignee: UserRef;
  Performer: UserRef;
  PreviousMessage: string;
  ProcessInstance: ApprovalStatus;
}

export interface VersionInfo {
  $type: string;
  CheckOutDate?: string;
  CheckOutUser?: UserRef;
  CreationDate: string;
  Creator: UserRef;
  IsNew: boolean;
  LastVersion: number;
  LockType?: string[];
  Revision: number;
  RevisionDate: string;
  Revisor: UserRef;
  SystemComment: string;
  UserComment: string;
  Version: number;
}

export interface SecurityDescriptor {
  $type: string;
  Permissions: string[];
  Rights: string[];
}

export interface ExtensionProperties {
  $type: string;
  [key: string]: unknown;
}

export interface Metadata {
  $type: string;
  maxItems?: unknown;
  [key: string]: unknown;
}

export interface LoadInfo {
  $type: string;
  ErrorMessage: string;
  ErrorType: string;
  State: string;
}

export interface LockInfo {
  $type: string;
  LockDate?: string;
  LockType: string[];
  LockUser: UserRef;
}

export interface LocationInfo {
  $type: string;
  ContextRepository?: ApprovalStatus;
  OrganizationalItem: ApprovalStatus;
  Path: string;
  PublishLocationPath?: string;
  PublishLocationUrl?: string;
  PublishPath?: string;
  WebDavUrl: string;
}

export interface DynamicVersionInfo {
  $type: string;
  Revision: number;
  RevisionDate: string;
  Revisor: UserRef;
}

export interface StyleValue {
  [key: string]: string | number | boolean;
}

export interface FormPageData {
  name: string;
  filename: string;
}

export interface FormPageDataRaw extends FormPageData {
  foldername: string;
  pageType: string;
  template: string;
  schema: string;
}

export interface PageTypeTemplate {
  Id: string;
  Title: string;
  RegionSchema: ApprovalStatus;
  PageTemplate: ApprovalStatus;
  [key: string]: unknown;
}
