export interface TridionMediaNode {
  id: string;
  url: string;
  binaryId: number;
  downloadUrl: string;
  path: string;
  type: string;
}

export interface TridionMediaEdge {
  node: TridionMediaNode;
}

export interface TridionMedia {
  variants?: {
    edges?: TridionMediaEdge[];
  };
}

export interface TridionLink {
  linkText: string;
  externalLink?: string | null;
  internalLink?: {
    id: string;
    itemId: number;
    title: string;
  } | null;
  alternateText?: string;
}

export interface TridionContentFragment {
  html: string;
}

export interface TridionBodyItem {
  subheading?: string;
  content?: {
    fragments?: TridionContentFragment[];
  };
  media?: TridionMedia | null;
}

export interface TridionComponentItem {
  id: string;
  itemId: number;
  publicationId: number;
  title: string;
  headline?: string;
  introduction?: string;
  resolvedLink: {
    url: string
  }
  itemListElement?: Array<{
    subheading?: string;
    content?: string | null;
    media?: TridionMedia;
    link?: TridionLink;
  }>;
  body?: TridionBodyItem[];
  articleBody?: TridionBodyItem[];
  image?: TridionMedia;
  link?: TridionLink;
}

export interface TridionRegion {
  name: string;
  components: TridionComponentItem[];
}

export interface TridionPageData {
  title: string;
  itemId: number;
  publicationId: number;
  itemType: number;
  regions: TridionRegion[];
}


export interface PageData {
  data: {
    typedPage: {
      rawContent: {
        data: {
          PageTemplate: {
            Title: string;
            Id?: string;
          };
          [key: string]: any;
        };
      };
    };
  };
}