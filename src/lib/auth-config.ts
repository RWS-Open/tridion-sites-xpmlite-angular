export interface AuthConfig {
    baseUrl:string;
    issuer: string;
    clientId: string;
    redirectUri: string;
}

import { InjectionToken } from "@angular/core";

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG')

export const INTERNAL_SCOPES = "openid profile role forwarded offline_access";