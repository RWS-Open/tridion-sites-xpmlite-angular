export const PAGE_QUERY = `query PageQuery($namespaceId: Int!, $publicationId: Int!, $url: String) {
  typedPage(
    namespaceId: $namespaceId
    publicationId: $publicationId
    url: $url
  ) {
    title
    name
    itemId
    publicationId
    itemType
    regions {
      name
      components {
        id
        itemId
        publicationId
        title
        ...ArticleComponent
        ...OfferingsComponent
        ...TeaserComponent
        ...ItemListComponent
      }
    }
  }
}

fragment ArticleComponent on Article {
  headline
  articleBody {
    subheading
    content {
      fragments {
        html
      }
    }
    media {
      ...BinaryImage
    }
  }
  image {
    ...BinaryImage
  }
}

fragment OfferingsComponent on Offering {
  headline
  introduction
  body {
    subheading
    content {
      fragments {
        html
      }
    }
    media {
      ...BinaryImage
    }
  }

  link {
    ...OfferingsComponentLink
  }
}

fragment TeaserComponent on Teaser {
  headline
  content {
    ... on UntypedContent {
      data
    }
  }

  media {
    ...BinaryImage
  }
  link {
    ...TeaserComponentLink
  }
}

fragment ItemListComponent on ItemList {
  headline
  itemListElement {
    __typename
    subheading
    content {
      fragments {
        html
      }
    }
    media {
      ...BinaryImage
    }
    link {
      ...ComponentItemListLink
    }
  }
}

fragment OfferingsComponentLink on Offering_Link {
  linkText
  externalLink
  internalLink {
    id
    itemId
    title
  }
  alternateText
}

fragment TeaserComponentLink on Teaser_Link {
  linkText
  externalLink
  internalLink {
    id
    itemId
    title
  }
  alternateText
}

fragment ComponentItemListLink on ItemList_Link {
  linkText
  externalLink
  internalLink {
    id
    itemId
    title
  }
  alternateText
}

fragment BinaryImage on BinaryComponent {
  variants {
    edges {
      node {
        id
        url
        binaryId
        downloadUrl
        path
        type
      }
    }
  }
}`