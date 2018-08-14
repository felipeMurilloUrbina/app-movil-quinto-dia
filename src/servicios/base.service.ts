import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
  
  @Injectable()
  export class BaseService {
  
    private actionUrl: string;
    private urlBase = 'http://quintodia.api.dev.facturasiweb.com/api/';
    // private urlBase = 'http://localhost:50249/api/';
    httpOptions: any;
    constructor(public http: HttpClient, public endPoint: string) {
      this.actionUrl = this.urlBase + endPoint;
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Cache-Control': 'no-cache',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      };
    }
    
    public getUrl(): string {
      return this.actionUrl;
    }
    
    public getAll<T>(pagina, registros) {
      var uri = this.actionUrl +'?pagina=' + pagina + '&registros=' + registros;
      return this.http.get<T>(uri, this.httpOptions);
    }
  
    public getSingle <T> (id: number) {
      return this.http.get <T> (this.actionUrl + '/' + id);
    }
  
    public save<T>(itemName, endPoint) {
      if(itemName.id) {
        return this.update(itemName, endPoint);
      } else {
        return this.add(itemName, endPoint);
      }
    }
  
    add <T> (itemName: T, endPoint) {
      return this.http.post <T> (this.actionUrl, itemName, this.httpOptions);
    }
  
    update <T> (itemToUpdate: any, endPoint) {
      return this.http
        .put<T>(this.actionUrl, itemToUpdate, this.httpOptions);
    }
  
    public delete <T> (id: number) {
      return this.http.delete <T>(this.actionUrl + '/' + id, this.httpOptions);
    }
  
    resolveFieldData(data: any, field: string): any {
      if (data && field) {
        if (field.indexOf('.') === -1) {
          return data[field];
        } else {
          const fields: string[] = field.split('.');
          let value = data;
          for (let i = 0, len = fields.length; i < len; ++i) {
            if (value == null) {
              return null;
            }
            value = value[fields[i]];
          }
          return value;
        }
      } else {
        return null;
      }
    }
  }
  