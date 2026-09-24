export const SITEMAP_QUERY = `query Sitemap($namespaceId: Int!, $publicationId: Int!, $url: String!) {
    typedPage(
      namespaceId: $namespaceId
      publicationId: $publicationId
      url: $url
    ) {
      
      rawContent{
        ... on RawContent{
          data
        }
      }
    }
  }
  `