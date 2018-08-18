import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { SalidaAlmacen } from './../modelos/salida-almacen.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { SQLiteService } from './sqlite.service';
import { Diagnostic } from '@ionic-native/diagnostic';
import {Observable} from 'rxjs/Rx';
@Injectable()
export class SalidaAlmacenService extends BaseService {
    constructor(public http: HttpClient, public servicioBD: SQLiteService,public storage: Storage, public geo: Geolocation, private diagnostic: Diagnostic) {
        super(http, 'salidas-almacen', storage);
    }

    public iniciarTarea() {
        Observable
        .interval(60000)
        .timeInterval()
        .flatMap(() => this.guardarApi())
        .subscribe(data => {
            // console.log(data);
        });
    }

    public guardarApi() {
        return this.servicioBD.ejecutarSQL('SELECT * FROM  salidaAlmacen WHERE REVISADO = 1 AND ENVIADO = 0;').then((datoEnviar) => {
            if((datoEnviar) && (datoEnviar.length>0)) {
                this.save(datoEnviar, '').subscribe(dato => {
                    this.servicioBD.ejecutarSQL('UPDATE salidaAlmacen SET  enviado = 1 WHERE revisado = 1;').then((res)=> {
                        console.log(res);
                    });
                });
            }
        });
    }

    public getLocal(consulta: string, cantidad: number, folio: number) {
        return this.servicioBD.getSalidas(consulta, cantidad, folio);
    }

    public getFolio() {
        return this.servicioBD.getFolioSalida(localStorage.getItem('bodega'));
    }

    public guardarLocal(salida: SalidaAlmacen) { 
        return this.diagnostic.isGpsLocationEnabled().then((estatus)=>{
            if(estatus === true) {
                return this.geo.getCurrentPosition().then((resp) => {
                    salida.posicion =resp.coords.latitude + ',' + resp.coords.longitude;
                    return this.servicioBD.agregarSalida(salida);
                }).catch((error)=> {
                    let watch = this.geo.watchPosition();
                    watch.subscribe((data) => {
                        salida.posicion =data.coords.latitude + ',' + data.coords.longitude;
                        return this.servicioBD.agregarSalida(salida);
                    });
                    return error;
                });
            } else {
                return this.servicioBD.agregarSalida(salida);
            }
        });
    }

    public cambiarEstatus(folio: number, estatus: boolean) {
        return this.servicioBD.cambiarStatus(folio, estatus);
    }
    
    public eliminarSalidas(folio: number) { 
        return this.servicioBD.eliminarSalidas(folio);
    }

    public eliminarSalida(salida: SalidaAlmacen) { 
        return this.servicioBD.eliminarSalida(salida);
    }
}