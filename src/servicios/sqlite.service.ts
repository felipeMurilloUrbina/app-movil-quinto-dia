import { CentroCosto } from './../modelos/centro-costo.model';
import { Articulo } from './../modelos/articulo.model';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class SQLiteService {

  private database: SQLiteObject;
  //initially set dbReady status to false
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private platform:Platform, private sqlite:SQLite) {
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'invent.db',
        location: 'default'
      })
      .then((db:SQLiteObject)=>{
        this.database = db;
        
        this.createTables().then(()=>{     
          //we loaded or created tables, so, set dbReady to true
          this.dbReady.next(true);
        });
      })

    });
  }

  private createTables(){
    let consultas= [];
    consultas.push(`CREATE TABLE IF NOT EXISTS articulos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT,
      descripcion TEXT,
      unidad TEXT,
      tipoMaterial TEXT,
      categoria TEXT,
      existencia REAL,
      costoPromedio REAL
    );`);
    consultas.push(`CREATE TABLE IF NOT EXISTS centroCostos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT,
      descripcion TEXT
      );`);
    consultas.push(`CREATE TABLE IF NOT EXISTS bodegas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descripcion TEXT,
      codigo TEXT
      );`);
    consultas.push(`CREATE TABLE IF NOT EXISTS salidaAlmacen (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descripcion TEXT,
      posicion TEXT,
      fecha TEXTO,
      codigo TEXT
      codigo REAL
      );`);
      return this.database.sqlBatch(consultas).then(()=> {
        console.log('aaaaaa');
      }).catch((error)=>{
        console.log(error);
      });
  }

  private isReady(){
    return new Promise((resolve, reject) =>{
      //if dbReady is true, resolve
      if(this.dbReady.getValue()){
        resolve();
      }
      //otherwise, wait to resolve until dbReady returns true
      else{
        this.dbReady.subscribe((ready)=>{
          if(ready){ 
            resolve(); 
          }
        });
      }  
    })
  }

  getArticulos(consulta: string, cantidad: number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql('SELECT * from articulos where descripcion like \'%' + consulta + '%\' limit ' + cantidad, [])
      .then((data)=>{
        let articulos = [];
        for(let i=0; i<data.rows.length; i++){
          articulos.push(data.rows.item(i));
        }
        return Promise.resolve( articulos );
      }).catch((error)=>{console.log("aaaa", error)});
    })
  }

  agregarArticulo(articulos: Articulo[]) {
    return this.isReady()
    .then(()=>{
      let articulo: Articulo;
      for(let i = 0; i < articulos.length; i++) {
        articulo = articulos[i];
        this.database.executeSql(`INSERT INTO articulos 
          (codigo, descripcion, unidad, tipoMaterial, categoria, existencia, costoPromedio) VALUES (?, ?, ?, ?, ?, ?, ?);`, 
          [articulo.codigo, articulo.descripcion.trim(), articulo.unidad.trim(), articulo.tipoMaterial.trim(), articulo.categoria.trim(), articulo.existencia, articulo.costoPromedio])
          .catch((err)=>console.log("error detected creating tables", err));
      }
    });      
  }

  borrarArticulos(){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`DELETE FROM articulos`, [])
    })
  }
  
  getCentroCosto(consulta: string, cantidad: number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql('SELECT * from centroCostos where descripcion like \'%' + consulta + '%\' limit ' + cantidad, [])
      .then((data)=>{
        let centroCostos = [];
        for(let i=0; i<data.rows.length; i++) {
          centroCostos.push(data.rows.item(i));
        }
        return Promise.resolve( centroCostos );
      }).catch((error)=>{console.log("aaaa", error)});
    })
  }

  agregarCentroCosto(centroCostos: CentroCosto[]) {
    return this.isReady()
    .then(()=>{
      let centroCosto: CentroCosto;
      for(let i = 0; i < centroCostos.length; i++) {
        centroCosto = centroCostos[i];
        this.database.executeSql(`INSERT INTO centroCostos 
          (codigo, descripcion) VALUES (?, ?);`, 
          [centroCosto.codigo, centroCosto.descripcion.trim()])
          .catch((err)=>console.log("error detected creating tables", err));
      }
    });      
  }
    
  borrarCentroCosto(){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`DELETE FROM centroCostos`, [])
    })
  }

  


  getList(id: number) {
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`SELECT * FROM list WHERE id = ${id}`, [])
      .then((data)=>{
        if(data.rows.length){
          return data.rows.item(0);
        }
        return null;
      })
    });
  }
}