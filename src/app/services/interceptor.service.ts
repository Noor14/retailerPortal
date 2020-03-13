import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private _router: Router,
    private _toast: ToastrService
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
      catchError((err: HttpErrorResponse) => {
        // Checking if it is an Authentication Error (401)
        if (err.status === 401 || err.status === 498) {
          // <Log the user out of your application code>
          if(err.status === 498){
            this._toast.error(err.name || err.error);
          }
          localStorage.clear()
          this._router.navigate([ '/login' ]);
          // return throwError(err);
        }
        // If it is not an authentication error, just throw it
        return throwError(err);
      })
    );
  }
}