import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { SQLiteService } from './sqlite.service';
import { Storage } from '@ionic/storage';
import { Articulo } from '../modelos/articulo.model';

@Injectable()
export class ArticuloService extends BaseService {
    constructor(public http: HttpClient, public storage: Storage, public servicioBD: SQLiteService) {
        super(http, 'articulos', storage);
        }

    public getLocal(consulta: string, cantidad: number) {
      return this.servicioBD.getArticulos(consulta, cantidad);
    }

    public sincronizarInfo() {
        this.servicioBD.borrarArticulos();
        return this.getAll(1, 0).subscribe(data=>{
            if(data !== null) {
                return this.servicioBD.agregarArticulo(<Articulo[]>data['items']).then(()=>{
                    return Promise.resolve('OK');
                }).catch((error) => Promise.resolve(error));
            }
        }, error => {
            Promise.resolve('Error');
        });
    }
    
}