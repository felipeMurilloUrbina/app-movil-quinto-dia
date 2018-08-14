import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
@Injectable()
export class CentroCostoService extends BaseService {
    constructor(public http: HttpClient) {
        super(http, 'centro-costos');
    }
}
