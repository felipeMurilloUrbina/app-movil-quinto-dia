import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
@Injectable()
export class BodegaService extends BaseService {
    constructor(public http: HttpClient, public storage: Storage) {
        super(http, 'bodegas', storage);
     }
}
