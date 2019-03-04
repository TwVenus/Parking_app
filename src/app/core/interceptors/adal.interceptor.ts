import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdalAuthentication } from '../services/adal.service';

@Injectable()
export class AdalInterceptor implements HttpInterceptor {
    constructor(private _adalService: AdalAuthentication) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.includes(environment.apiConfig.api_name)) {
            request = request.clone({
                setHeaders: {
                    // We use AccessToken for Azure AD
                    // Authorization: `Bearer ${environment.adalToken.accessToken}`,

                    // We use IdToken for AD FS
                    Authorization: `Bearer ${environment.adalToken.idToken}`,
                    'Access-Control-Allow-Origin': '*'
                }
            })
        }
        return next.handle(request);
    }
}
