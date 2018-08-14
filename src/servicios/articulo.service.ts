import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
// import { SQLiteService } from './sqlite.service';
@Injectable()
export class ArticuloService extends BaseService {
    constructor(public http: HttpClient) {
        super(http, 'articulos');
        //public servicioBD: SQLiteService
    }

    // public getOffline() {
    //     this.servicioBD.get('articulos')
    // }
    
}