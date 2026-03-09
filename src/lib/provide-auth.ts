import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core"
import { AUTH_CONFIG, AuthConfig, INTERNAL_SCOPES } from "./auth-config";

export function provideXpmAuth(config: AuthConfig): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: AUTH_CONFIG,
            useValue: {
                ...config,
                scope: INTERNAL_SCOPES
            }
        }
    ])
}