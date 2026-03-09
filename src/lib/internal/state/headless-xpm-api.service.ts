import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { inject, Injectable } from "@angular/core";

import { AuthService } from "./headless-xpm-auth.service";
import { AuthResponse } from "./headless-xpm-page.model";
import { AUTH_CONFIG, AuthConfig } from "../../auth-config";

@Injectable({
    providedIn: "root"
})

export class XpmApiService {
    private readonly httpClient = inject(HttpClient);
    private readonly authService = inject(AuthService);
    private readonly config: AuthConfig = inject(AUTH_CONFIG)
    
    private readonly baseUrl = this.config.baseUrl;
    private readonly token = this.authService.getAccessToken()

    private getRequestHeaders(): HttpHeaders {
        return new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`
        });
    }

    getItem<T, TBody>(url: string, body: TBody): Observable<T> {
        return this.httpClient.post<T>(`${this.baseUrl}${url}`, body, { headers: this.getRequestHeaders() }).pipe(
            catchError((error:HttpErrorResponse) => this.handleHttpError<T>(error, () => this.getItem(url, body)))
        )
    }

    getItems<T>(url: string): Observable<T> {
        return this.httpClient.get<T>(`${this.baseUrl}${url}`, { headers: this.getRequestHeaders() }).pipe(
            catchError((error: HttpErrorResponse) => this.handleHttpError<T>(error, () => this.getItems(url)))
        )
    }

    updateItem<T>(url: string, body: T): Observable<T> {
        return this.httpClient.put<T>(`${this.baseUrl}${url}`, body, { headers: this.getRequestHeaders() }).pipe(
            catchError((error: HttpErrorResponse) => this.handleHttpError<T>(error, () => this.updateItem(url, body)))
        )
    }

    checkOutItem<T>(url: string, body: Partial<T>): Observable<T> {
        return this.httpClient.post<T>(`${this.baseUrl}${url}`, body, { headers: this.getRequestHeaders() }).pipe(
            catchError((error: HttpErrorResponse) => this.handleHttpError<T>(error, () => this.checkOutItem(url, body)))
        )
    }

    checkin<T>(url: string, body: T): Observable<T> {
        return this.httpClient.post<T>(`${this.baseUrl}${url}`, body, { headers: this.getRequestHeaders() }).pipe(
            catchError((error: HttpErrorResponse) => this.handleHttpError<T>(error, () => this.checkin(url, body)))
        )
    }

    publish<T>(url: string, body: T): Observable<T> {
        return this.httpClient.post<T>(`${this.baseUrl}${url}`, body, { headers: this.getRequestHeaders() }).pipe(
            catchError((error: HttpErrorResponse) => this.handleHttpError<T>(error, () => this.publish(url, body)))
        )
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