import { Injectable, inject } from '@angular/core';
import {
    HttpClient,
    HttpHeaders,
    HttpParams,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface RequestOptions {
    headers?: HttpHeaders | Record<string, string | string[]>;
    params?: HttpParams | Record<string, any>;
    responseType?: 'json';
    withCredentials?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class ApiClientService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = "https://sites.tridiondemo.com:8081";

    private buildParams(params?: HttpParams | Record<string, any>): HttpParams {
        if (!params) return new HttpParams();
        if (params instanceof HttpParams) return params;

        let httpParams = new HttpParams();
        for (const [key, value] of Object.entries(params)) {
            if (value !== null && value !== undefined) {
                httpParams = httpParams.set(key, String(value));
            }
        }
        return httpParams;
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        const errorPayload = {
            status: error.status,
            statusText: error.statusText,
            message: error.error?.message || error.message || 'API request failed',
            raw: error,
        };
        return throwError(() => errorPayload);
    }

    private formatUrl(endpoint: string): string {
        if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
            return endpoint;
        }
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return `${this.baseUrl}${cleanEndpoint}`;
    }

    // GET
    get<T>(endpoint: string, options?: RequestOptions): Observable<T> {
        return this.http
            .get<T>(this.formatUrl(endpoint), {
                ...options,
                params: this.buildParams(options?.params),
            })
            .pipe(catchError(this.handleError));
    }

    // POST
    post<T>(endpoint: string, body: any, options?: RequestOptions): Observable<T> {
        return this.http
            .post<T>(this.formatUrl(endpoint), body, {
                ...options,
                params: this.buildParams(options?.params),
            })
            .pipe(catchError(this.handleError));
    }

    // PUT
    put<T>(endpoint: string, body: any, options?: RequestOptions): Observable<T> {
        return this.http
            .put<T>(this.formatUrl(endpoint), body, {
                ...options,
                params: this.buildParams(options?.params),
            })
            .pipe(catchError(this.handleError));
    }

    // PATCH
    patch<T>(endpoint: string, body: any, options?: RequestOptions): Observable<T> {
        return this.http
            .patch<T>(this.formatUrl(endpoint), body, {
                ...options,
                params: this.buildParams(options?.params),
            })
            .pipe(catchError(this.handleError));
    }

    // DELETE
    delete<T>(endpoint: string, options?: RequestOptions): Observable<T> {
        return this.http
            .delete<T>(this.formatUrl(endpoint), {
                ...options,
                params: this.buildParams(options?.params),
            })
            .pipe(catchError(this.handleError));
    }
}