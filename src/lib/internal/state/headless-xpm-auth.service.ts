import { BehaviorSubject, catchError, from, map, Observable } from "rxjs";
import { inject, Injectable, signal } from "@angular/core";

import { PkceUtils } from "../utils/pkce.util";
import { AUTH_CONFIG, AuthConfig, INTERNAL_SCOPES } from "../../auth-config";
import { AUTH_TOKEN_KEY, AuthResponse } from "./headless-xpm-page.model";
@Injectable({
    providedIn: "root"
})

export class AuthService {
    private readonly TOKEN_KEY = AUTH_TOKEN_KEY.TOKEN_KEY;
    private readonly RETURN_URL = AUTH_TOKEN_KEY.RETURN_URL;
    private readonly AUTH_VERIFIER = AUTH_TOKEN_KEY.AUTH_VERIFIER;

    private readonly _isAuthenticated = signal<boolean>(false)
    private readonly _authToken = signal<AuthResponse | null>(null)
    readonly authToken = this._authToken.asReadonly()
    readonly isAuthenticated = this._isAuthenticated.asReadonly()

    private authStatus$ = new BehaviorSubject<boolean>(false)
    public isAuthenticated$: Observable<boolean> = this.authStatus$.asObservable()

    private readonly config: AuthConfig = inject(AUTH_CONFIG)

    private generateAuthState() {
        return Math.random().toString(36).substring(2, 15);
    }

    setAuthenticated(status: boolean) {
        this._isAuthenticated.set(status);
        this.authStatus$.next(status);
    }

    constructor() {
        this.restoreSession();
        this.authenticate();
    }

    private restoreSession() {
        const stored = sessionStorage.getItem(this.TOKEN_KEY);
        if (!stored) {
            return
        }

        const parsed = JSON.parse(stored);

        if (parsed.expires_in && parsed.expires_in > Date.now()) {
            this._authToken.set(parsed)
            this.updateAuthState(true)
        } else {
            sessionStorage.removeItem(this.TOKEN_KEY)
            this.updateAuthState(false)
        }
    }
    private updateAuthState(status: boolean) {
        this._isAuthenticated.set(status);
        this.authStatus$.next(status)
    }
    processTokenResponse(tokens: AuthResponse): void {
        const expires_at = Date.now() + (tokens.expires_in * 1000) - 30000;
        const authData = {
            ...tokens,
            expires_in: expires_at
        }
        this._authToken.set(authData)
        sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(authData))
        // this.authStatus$.next(true)
        this.updateAuthState(true);
        sessionStorage.removeItem(this.AUTH_VERIFIER)
        const returnUrl = sessionStorage.getItem(this.RETURN_URL)
        sessionStorage.removeItem(this.RETURN_URL)
        if (returnUrl && window.location.href !== returnUrl) {
            window.location.replace(returnUrl)

        } else {
            this.redirectOnSuccess()
        }
    }
    private redirectOnSuccess() {
        const url = new URL(window.location.href)
        url.searchParams.delete('code')
        url.searchParams.delete('state')
        url.searchParams.delete('session_state')

        window.history.replaceState({}, "", url.toString())
    }

    getAccessToken(): string | null {
        const token = this._authToken();
        if (!token) {
            return null
        }
        if (token?.expires_in && token?.expires_in <= Date.now()) {
            this.logout();
            return null;
        }
        return token.access_token
    }

    refreshAccessToken(): Observable<AuthResponse> {
        const authStorageData = this._authToken() as AuthResponse;
        if (!authStorageData?.refresh_token) {
            throw new Error("Authentication Failed")
        }

        const body = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: this.config.clientId,
            refresh_token: authStorageData.refresh_token
        })

        return from(
            fetch(`${this.config.issuer}/token`, {
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body
            })
                .then(response => response.json())  // Handle response as JSON
                .then(refreshToken => {
                    this.processTokenResponse(refreshToken);  // Process token on success
                    return refreshToken;  // Return the refreshed token as an AuthResponse
                })
        ).pipe(
            map((refreshToken) => {
                return refreshToken
            }),
            catchError(error => {
                console.error('Failed to Authenticate:', error);
                throw error;
            })
        )
    }

    async authenticate() {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const verifier = sessionStorage.getItem(this.AUTH_VERIFIER);

        if (!code || !verifier) {
            //throw new Error("Invalid flow")
            //console.log("Invalid Flow")
            return
        }

        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: this.config.clientId,
            code: code || "",
            redirect_uri: this.config.redirectUri,
            code_verifier: verifier || ""
        })

        const response = await fetch(`${this.config.issuer}/token`, {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        })
        const authResponse = await response.json()
        if (!response.ok) {
            console.error("Server Error:", authResponse);
            throw new Error("Server Error", authResponse)

        }
        this.processTokenResponse(authResponse)
    }

    async login() {
        if (typeof window === 'undefined') return;
        const verifier = PkceUtils.generateVerifier();
        const challenge = await PkceUtils.generateChallenge(verifier)
        const redirectUri = typeof window !== 'undefined' ? this.config.redirectUri : '';

        sessionStorage.setItem(this.AUTH_VERIFIER, verifier)
        sessionStorage.setItem(this.RETURN_URL, window.location.href)
        const authUrl = `${this.config.issuer}/authorize?` +
            `response_type=code&` +
            `client_id=${this.config.clientId}&` +
            `state=${this.generateAuthState()}&` +
            `redirect_uri=${redirectUri}&` +
            `scope=${INTERNAL_SCOPES}&` +
            `code_challenge=${challenge}&` +
            `code_challenge_method=S256`;
        window.location.href = authUrl
    }

    async logout() {
        sessionStorage.removeItem(this.TOKEN_KEY)
        sessionStorage.removeItem(this.AUTH_VERIFIER)
        sessionStorage.removeItem(this.RETURN_URL)
        this._authToken.set(null);
        this.updateAuthState(false);
        this.setAuthenticated(false)
        //this.authStatus$.next(false);
        // this._isAuthenticated.set(false)
        // this.hasAuthenticated()
    }
}