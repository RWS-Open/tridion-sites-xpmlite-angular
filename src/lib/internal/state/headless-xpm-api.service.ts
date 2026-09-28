import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";

import { AUTH_CONFIG, AuthConfig } from "../../auth-config";
import { CheckInPayload, ItemResponse } from "../tridion-bar/page-info/page-info.model";
import { AuthService } from "./headless-xpm-auth.service";
import { AuthResponse } from "./headless-xpm-page.model";

@Injectable({
    providedIn: "root"
})

export class XpmApiService {
    private readonly httpClient = inject(HttpClient);
    private readonly authService = inject(AuthService);
    private readonly config: AuthConfig = inject(AUTH_CONFIG)

    private readonly baseUrl = this.config.baseUrl;
    //private readonly token = this.authService.getAccessToken()

    private getRequestHeaders(): HttpHeaders {
        return new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
        });
    }

    postItem<TResponse = ItemResponse, TBody = unknown>(url: string, body: TBody): Observable<TResponse> {
        return this.httpClient.post<TResponse>(`${this.baseUrl}${url}`, body, { headers: this.getRequestHeaders() }).pipe(
            catchError((error: HttpErrorResponse) => this.handleHttpError<TResponse>(error, () => this.postItem(url, body)))
        )
    }

    getItems<T>(url: string): Observable<T> {
        return this.httpClient.get<T>(`${this.baseUrl}${url}`, { headers: this.getRequestHeaders() }).pipe(
            catchError((error: HttpErrorResponse) => this.handleHttpError<T>(error, () => this.getItems(url)))
        )
    }

    updateItem<TResponse = ItemResponse, TBody = unknown>(url: string, body: TBody): Observable<TResponse> {
        return this.httpClient.put<TResponse>(`${this.baseUrl}${url}`, body, { headers: this.getRequestHeaders() }).pipe(
            catchError((error: HttpErrorResponse) => this.handleHttpError<TResponse>(error, () => this.updateItem(url, body)))
        )
    }

    checkOutItem<TResponse = ItemResponse, TBody = Record<string, unknown>>(url: string, body: TBody): Observable<TResponse> {
        return this.httpClient.post<TResponse>(`${this.baseUrl}${url}`, body, { headers: this.getRequestHeaders() }).pipe(
            catchError((error: HttpErrorResponse) => this.handleHttpError<TResponse>(error, () => this.checkOutItem(url, body)))
        )
    }
    checkin<TResponse = ItemResponse, TBody = Partial<CheckInPayload>>(url: string, body: TBody): Observable<TResponse> {
        return this.httpClient.post<TResponse>(`${this.baseUrl}${url}`, body, { headers: this.getRequestHeaders() }).pipe(
            catchError((error: HttpErrorResponse) => this.handleHttpError<TResponse>(error, () => this.checkin(url, body)))
        )
    }


    publish<TResponse = unknown, TBody = unknown>(url: string, body: TBody): Observable<TResponse> {
        return this.httpClient.post<TResponse>(`${this.baseUrl}${url}`, body, { headers: this.getRequestHeaders() }).pipe(
            catchError((error: HttpErrorResponse) => this.handleHttpError<TResponse>(error, () => this.publish<TResponse, TBody>(url, body)))
        );
    }

    private handleHttpError<T>(error: HttpErrorResponse, retryFn: () => Observable<T>): Observable<T> {
        if (error.status === 401 && error.error?.Message.includes("Authorization has been denied for this request.")) {
            // If the token has expired, refresh the token and retry the request
            return this.refreshTokenAndRetry(retryFn);
        }
        return throwError(() => error);
    }

    private refreshTokenAndRetry<T>(retryFn: () => Observable<T>): Observable<T> {
        return this.authService.refreshAccessToken().pipe(
            switchMap((newAccessToken: AuthResponse) => {
                this.authService.processTokenResponse(newAccessToken);
                return retryFn()
            }),
            catchError((err) => {
                this.authService.logout();
                return throwError(() => err)
            })
        )
    }
}