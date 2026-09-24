const ACCESS_MANAGMENT_BASE_URL = "";
const CONTENT_MANAGER_URL = "";

export const environment = {
  production: true,
  clientId:"",
  issuer:`${ACCESS_MANAGMENT_BASE_URL}/access-management/connect`,
  openApiUrl:`${CONTENT_MANAGER_URL}/api/v3.0`,
  redirectUri:window.location.origin,

  graphqlBaseUrl: `${CONTENT_MANAGER_URL}:8081/cd/api`,
  experience_space_editor: `${CONTENT_MANAGER_URL}/ui/editor`,
  staging: true,
  showToolbar: true,
  showPageEditorLink: true
};
