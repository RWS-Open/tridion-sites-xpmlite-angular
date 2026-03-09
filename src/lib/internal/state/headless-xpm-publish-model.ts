export interface PublishTargetTypes {
  title: string
  id: number
}

export interface PublicationListKeyValues {
  title: string
  id: number
}

export interface PublishBody {
  Ids: string[],
  Priority?: string;
  TargetIdsOrPurposes: string[],
  PublishInstruction: {
    DeployAt?: string
    ResolveInstruction: {
      IncludeChildPublications: boolean,
      IncludeComponentLinks: boolean,
      IncludeCurrentPublication: boolean,
      IncludeDynamicVersion: boolean,
      IncludeWorkflow: boolean,
      PublishInChildPublications: string[],
      PublishNewContent: boolean
    }
  }
}