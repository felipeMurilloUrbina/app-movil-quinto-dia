import { Geolocation } from '@ionic-native/geolocation';
import { SalidaAlmacen } from './../modelos/salida-almacen.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { SQLiteService } from './sqlite.service';
@Injectable()
export class SalidaAlmacenService extends BaseService {
    constructor(public http: HttpClient, public servicioBD: SQLiteService,public geo: Geolocation) {
        super(http, 'articulos');
        }

    public getLocal(consulta: string, cantidad: number) {
        return this.servicioBD.getSalidas(consulta, cantidad);
    }

    public getFolio() {
        console.log('aaaaa');
        return this.servicioBD.getFolioSalida(localStorage.getItem('bodega'));
    }
    public guardarLocal(salida: SalidaAlmacen) {
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
    }
    // public sincronizarInfo() {
    //     this.servicioBD.borrarArticulos();
    //     return this.getAll(1, 0).subscribe(data=>{
    //         return this.servicioBD.agregarArticulo(<SalidaAlmacen[]>data['items']).then(()=>{
    //             return Promise.resolve('OK');
    //         });
    //     });
    // }
    
}