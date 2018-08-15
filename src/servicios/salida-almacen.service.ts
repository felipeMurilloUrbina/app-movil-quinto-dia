import { SalidaAlmacen } from './../modelos/salida-almacen.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { SQLiteService } from './sqlite.service';
@Injectable()
export class SalidaAlmacenService extends BaseService {
    constructor(public http: HttpClient, public servicioBD: SQLiteService) {
        super(http, 'articulos');
        }

    public getLocal(consulta: string, cantidad: number) {
      return this.servicioBD.get(consulta, cantidad);
    }

    public sincronizarInfo() {
        this.servicioBD.borrarArticulos();
        return this.getAll(1, 0).subscribe(data=>{
            return this.servicioBD.agregarArticulo(<SalidaAlmacen[]>data['items']).then(()=>{
                return Promise.resolve('OK');
            });
        });
    }
    
}