import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';

import { AuthService } from './headless-xpm-auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);
    const token = authService.getAccessToken()

    let authReq = req;
    if(token){
        authReq = req.clone({
            setHeaders:{Authorization:`Bearer ${token}`}
        })
    }

    return next(authReq).pipe(
        catchError((error:HttpErrorResponse) => {
            if(error.status===401){
                return authService.refreshAccessToken().pipe(
                    switchMap(newToken => {
                        const retryReq = req.clone({
                            setHeaders:{
                                Authorization:`Bearer:${newToken}`
                            }
                        })
                        return next(retryReq)
                    })
                )
                //authService.logout()
            }
            return throwError(() => error)
        })
    );
};