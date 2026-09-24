
export interface PageData {
    data: Data2;
  }
  
  interface Data2 {
    typedPage: TypedPage;
  }
  
  interface TypedPage {
    title: string;
    itemId: number;
    publicationId: number;
    itemType: number;
    name: null;
    pageTemplate: PageTemplate;
    rawContent: RawContent;
    regions: Region3[];
  }
  
  interface Region3 {
    name: string;
    components: ComponentData[];
  }
  
  export interface ComponentData {
    id: string;
    itemId: number;
    publicationId: number;
    title: string;
    headline: string;
    itemListElement?: ItemListElement[];
    introduction?: string;
    resolvedLink?: ResolvedLink;
    body?: Body[];
    link?: Link2;
    articleBody?: ArticleBody2[];
    image?: Media;
  }
  
  interface ArticleBody2 {
    subheading: string;
    content: Content2;
    media: null;
  }
  
  interface Link2 {
    linkText: string;
    externalLink: null;
    internalLink: InternalLink;
    alternateText: string;
  }
  
  interface InternalLink {
    id: string;
    itemId: number;
    title: string;
  }
  
  interface Body {
    subheading: string;
    content: Content2;
    media: Media;
  }
  
  interface Content2 {
    fragments: Fragment[];
  }
  
  interface Fragment {
    html: string;
  }
  
  interface ResolvedLink {
    url: string;
    type: string;
    page: Page;
  }
  
  interface Page {
    url: string;
    fileName: string;
  }
  
  interface ItemListElement {
    __typename: string;
    subheading: string;
    content: null;
    media: Media;
    link: Link;
  }
  
  interface Link {
    linkText: string;
    externalLink: string;
    internalLink: null;
    alternateText: string;
  }
  
  interface Media {
    variants: Variants;
  }
  
  interface Variants {
    edges: Edge[];
  }
  
  interface Edge {
    node: Node;
  }
  
  interface Node {
    id: string;
    url: string;
    binaryId: number;
    downloadUrl: string;
    path: string;
    type: string;
  }
  
  interface RawContent {
    data: Data;
  }
  
  interface Data {
    Id: string;
    Namespace: string;
    Title: string;
    PageTemplate: PageTemplate2;
    StructureGroupId: string;
    UrlPath: string;
    Meta: Meta;
    Regions: Region2[];
    MvcData: MvcData;
    XpmMetadata: XpmMetadata4;
    SchemaId: string;
  }
  
  interface XpmMetadata4 {
    PageID: string;
    PageModified: string;
    PageTemplateID: string;
    PageTemplateModified: string;
  }
  
  interface Region2 {
    Name: string;
    Entities?: Entity[];
    Regions?: Region[];
    MvcData: MvcData;
    XpmMetadata: XpmMetadata3;
    Metadata?: Metadata3;
    SchemaId?: string;
    IncludePageId?: string;
  }
  
  interface Metadata3 {
    maxItems: string;
  }
  
  interface XpmMetadata3 {
    FullyQualifiedName?: string;
    IncludedFromPageID?: string;
    IncludedFromPageTitle?: string;
    IncludedFromPageFileName?: string;
  }
  
  interface Region {
    Name: string;
    Entities: Entity2[];
    Regions: any[];
    MvcData: MvcData;
    XpmMetadata: XpmMetadata2;
    SchemaId: string;
  }
  
  interface XpmMetadata2 {
    FullyQualifiedName: string;
  }
  
  interface Entity2 {
    Id: string;
    Namespace: string;
    ComponentTemplate: ComponentTemplate;
    Folder: Folder;
    MvcData: MvcData;
    XpmMetadata: XpmMetadata;
    SchemaId: string;
  }
  
  interface Entity {
    Id: string;
    Namespace: string;
    ComponentTemplate?: ComponentTemplate;
    Folder?: Folder;
    Content?: Content;
    MvcData?: MvcData;
    XpmMetadata?: XpmMetadata;
    SchemaId?: string;
  }
  
  interface XpmMetadata {
    ComponentID: string;
    ComponentModified: string;
    ComponentTemplateID: string;
    ComponentTemplateModified: string;
    IsRepositoryPublished: boolean;
  }
  
  interface MvcData {
    ViewName: string;
    AreaName: string;
  }
  
  interface Content {
    headline: string;
    image: Image;
    articleBody: ArticleBody;
  }
  
  interface ArticleBody {
    '$type': string;
    subheading: string;
    content: string;
  }
  
  interface Image {
    '$type': string;
    Id: string;
    Namespace: string;
    ComponentTemplate: ComponentTemplate2;
    Folder: Folder;
    BinaryContent: BinaryContent;
    SchemaId: string;
  }
  
  interface BinaryContent {
    Url: string;
    FileName: string;
    FileSize: number;
    MimeType: string;
  }
  
  interface ComponentTemplate2 {
    Id: string;
    Namespace: string;
    RevisionDate: string;
  }
  
  interface Folder {
    Id: string;
    Title: string;
  }
  
  interface ComponentTemplate {
    Id: string;
    Namespace: string;
    Title: string;
    RevisionDate: string;
    OutputFormat: string;
    Metadata: Metadata2;
  }
  
  interface Metadata2 {
    view: string;
  }
  
  interface Meta {
    'twitter:card': string;
    'og:title': string;
    'og:type': string;
    'og:locale': string;
    description: string;
  }
  
  interface PageTemplate2 {
    Id: string;
    Namespace: string;
    Title: string;
    FileExtension: string;
    RevisionDate: string;
    Metadata: Metadata;
  }
  
  interface Metadata {
    includes: Includes;
    view: string;
  }
  
  interface Includes {
    '$type': string;
    '$values': string[];
  }
  
  interface PageTemplate {
    itemId: number;
    title: null;
  }