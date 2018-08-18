import { Storage } from '@ionic/storage';
import { CentroCosto } from './../modelos/centro-costo.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { SQLiteService } from './sqlite.service';
@Injectable()
export class CentroCostoService extends BaseService {
    constructor(public http: HttpClient, public storage: Storage, public servicioBD: SQLiteService) {
        super(http, 'centro-costos', storage);
    }

    public getLocal(consulta: string, cantidad: number) {
      return this.servicioBD.getCentroCosto(consulta, cantidad);
    }

    public sincronizarInfo() {
        this.servicioBD.borrarCentroCosto();
        return this.getAll(1, 0).subscribe(data => {
            if(data !== null) {
                return this.servicioBD.agregarCentroCosto(<CentroCosto[]>data['items']).then(() => {
                    return Promise.resolve('OK');
                });
            } 
            return Promise.resolve('Ok');
        }, error => {
            return Promise.resolve('Error');
        });
    }
}
