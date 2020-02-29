import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private _router: Router
  ) { }
  intercept(
    request: HttpRequest<any>, next: HttpHandler
  ) : Observable<HttpEvent<any>> {
    const storageUser = localStorage.getItem('userIdentity');
    const loggedUser = storageUser ? JSON.parse(storageUser) : null;
    if (loggedUser) {
      request = request.clone({
          setHeaders:{
            'Content-Type': 'application/json; charset=utf-8',
            'dataType': 'json',
          },
          headers: request.headers.set(
            'authorization', `Bearer ${loggedUser.access_token}`
          )
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Checking if it is an Authentication Error (401)
        if (error.status === 401) {
          // <Log the user out of your application code>
          this._router.navigate([ '/login' ]);
          // return throwError(error);
        }
        // If it is not an authentication error, just throw it
        return throwError(error);
      })
    );
  }
}