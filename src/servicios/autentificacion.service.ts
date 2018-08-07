import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Usuario } from "../modelos/usuario.model";

@Injectable()
export class AutentificacionService {
    constructor(private http: HttpClient) {

    }
    login(user: Usuario) {
        let body = 'username=' + user.username + '&password=' + user.password + '&grant_type=password&client_id=' + '099153c2625149bc8ecb3e85e03f0022';
        return this.http.post<any>('http://api.avika.facturasiweb.com/api/' + 'token',
                body,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .pipe(map((res: any) => {
                // login successful if there's a jwt token in the response
                if (res && res.access_token) {
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('token',  res.access_token);
                    return true;
                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('token');
    }
}