
export interface PageData {
  data: PData;
}

interface PData {
  typedPage: TypedPage;
}

export interface TypedPage {
  title: string;
  name: string;
  itemId:number;
  publicationId:number;
  itemType:number;
  regions: Region[];
}

export interface Region {
  name: string;
  components: ComponentData[];
}

export interface ComponentData {
  id: string;
  title: string;
  publicationId: string,
  itemId: string,
  headline: string;
  content:{
    data:{
      $type:string;
      headline:string;
      content:string
      link:Link2
    }
  }
  itemListElement?: ItemListElement[];
  introduction?: string;
  body?: Body[];
  link?: Link2;
  articleBody?: Body[];
  image:Media
  media:Media
}

interface Link2 {
  linkText: string;
  externalLink: null;
  internalLink: InternalLink;
}

interface InternalLink {
  id: string;
  title: string;
  itemId: number;
}

interface Body {
  subheading: string;
  content: Content;
  media: Media
}

interface Content {
  fragments: Fragment[];
}

interface Media {
  variants: Variants
}

interface Variants {
  edges: MediaEdges[]
}

interface MediaEdges {
  node: MediaNode
}


interface MediaNode {
  downloadUrl: string
}

interface Fragment {
  html: string;
}

interface ItemListElement {
  subheading: string;
  content: null;
  link: Link;
  media: Media
}

interface Link {
  linkText: string;
  externalLink: string;
  internalLink: null;
  alternateText: string;
}