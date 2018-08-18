import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Usuario } from "../modelos/usuario.model";
import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Granja } from '../modelos/granja.model';

@Injectable()
export class AutentificacionService {
    private urlBase = 'http://quintodia.api.dev.facturasiweb.com/api/';
    // private urlBase = 'http://192.168.1.168:50249/api/';
    constructor(private http: HttpClient, private storage: Storage) {

    }
    login(user: Usuario) {
        let body = 'username=' + user.username + '&password=' + user.password + '&grant_type=password&client_id=' + '099153c2625149bc8ecb3e85e03f0022';
        return this.http.post<any>(this.urlBase + 'token',
                body,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .pipe(map((res: any) => {
                // login successful if there's a jwt token in the response
                if (res && res.access_token) {
                    const servicioJWT = new  JwtHelperService();
                    const usuario = servicioJWT.decodeToken(res.access_token);
                    const granjas = <Granja[]>JSON.parse(usuario["http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"]);
                    this.storage.remove('token');
                    this.storage.remove('granja');
                    this.storage.set('token',  res.access_token);
                    if(granjas.length === 1) {
                        this.storage.set('granja',  granjas[0].ConexionString);
                    }
                    return true;
                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('token');
    }
}