import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
@Injectable()
export class BodegaService extends BaseService {
    constructor(public http: HttpClient) {
        super(http, 'bodegas');
     }
}
