import { SalidaAlmacen } from './../modelos/salida-almacen.model';
import { CentroCosto } from './../modelos/centro-costo.model';
import { Articulo } from './../modelos/articulo.model';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class SQLiteService {

  private database: SQLiteObject;
  //initially set dbReady status to false
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private sqlite:SQLite) {
  }

  public creartablas(){
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
    });
  }

  private createTables(){
    let consultas= [];
    consultas.push('DROP TABLE articulos;');
    consultas.push('DROP TABLE centroCostos;');
    consultas.push('DROP TABLE salidaAlmacen;');
    // consultas.push('DROP TABLE salidaAlmacen;');
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
    // consultas.push('DROP TABLE salidaAlmacen;');
    consultas.push(`CREATE TABLE IF NOT EXISTS salidaAlmacen (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      folio INTEGER,
      numeroFila INTEGER,
      codigoArticulo TEXT,
      descripcion TEXT,
      unidad TEXT,
      costoPromedio REAL,
      codigoBodega TEXT,
      codigoCentroCosto1 TEXT,
      codigoCentroCosto2 TEXT,
      usuario TEXT,
      posicion TEXT,
      fecha TEXT,
      hora TEXT,
      cantidad REAL,
      revisado INTEGER,
      enviado INTEGER
      );`);

      return this.database.sqlBatch(consultas).catch((error)=>{
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
      return this.database.executeSql('SELECT * FROM articulos WHERE descripcion LIKE \'%' + consulta + '%\' LIMIT ' + cantidad, [])
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
    });
  }
  
  getCentroCosto(consulta: string, cantidad: number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql('SELECT * FROM centroCostos WHERE descripcion LIKE \'%' + consulta + '%\' LIMIT ' + cantidad, [])
      .then((data)=>{
        let centroCostos = [];
        for(let i=0; i<data.rows.length; i++) {
          centroCostos.push(data.rows.item(i));
        }
        return Promise.resolve( centroCostos );
      }).catch((error)=>{console.log("aaaa", error)});
    });
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

  getSalidas(consulta: string, cantidad: number, folio: number) {
    return this.isReady()
    .then(()=>{
      return this.database.executeSql('SELECT * FROM salidaAlmacen WHERE descripcion LIKE \'%' + consulta + '%\' AND folio= ' + folio + ' LIMIT ' + cantidad, [])
      .then((data)=>{
        let salidas = [];
        for(let i=0; i<data.rows.length; i++){
          salidas.push(data.rows.item(i));
        }
        return Promise.resolve( salidas );
      }).catch((error)=>{console.log("aaaa", error)});
    })
  }

  getFolioSalida(codigoBodega: string) {
    return this.isReady().then(()=> {
      return this.database.executeSql('SELECT MAX(folio) as folio FROM salidaAlmacen WHERE revisado = 1;', [])
      .then((data)=>{
        return Promise.resolve( data.rows.item(0) );
      }).catch((error)=>{console.log("aaaa", error)});
    });
  }
  getNumeroFila(folio: number) {
    return this.isReady().then(()=> {
      return this.database.executeSql('SELECT MAX(numeroFila) as numeroFila FROM salidaAlmacen WHERE folio ='+ folio, [])
      .then((data)=>{
        return Promise.resolve( data.rows.item(0) );
      }).catch((error)=>{console.log("aaaa", error)});
    });
  }

  ejecutarSQL(consulta) {
    return this.isReady().then(()=> {
      return this.database.executeSql(consulta, [])
      .then((data) => {
        let salidas = [];
        for(let i=0; i < data.rows.length; i++){
          salidas.push(data.rows.item(i));
        }
        return Promise.resolve( salidas );
      }).catch((error)=>{console.log("aaaa", error)});
    });
  }

  agregarSalida(salida: SalidaAlmacen) {
    return this.isReady()
    .then(() => {
      this.getNumeroFila(salida.folio).then((dato) => {
        salida.numeroFila = dato.numeroFila ===null ? 1 : dato.numeroFila;
        this.database.executeSql(`INSERT INTO salidaAlmacen 
          (folio, numeroFila, codigoArticulo, descripcion, unidad, costoPromedio, codigoBodega, codigoCentroCosto1, codigoCentroCosto2, 
           usuario, posicion, fecha, hora, cantidad, enviado, revisado ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, 
          [salida.folio,
           salida.numeroFila,
           salida.codigoArticulo.trim(),
           salida.descripcion.trim(),
           salida.unidad.trim(),
           salida.costoPromedio,
           salida.codigoBodega.trim(),
           salida.codigoCentroCosto1.trim(),
           salida.codigoCentroCosto2.trim(),
           salida.usuario.trim(),
           salida.posicion,
           salida.fecha,
           salida.hora,
           salida.cantidad,
           salida.enviado ? 1 : 0, 
           0]
          )
          .catch((err)=>console.log("Error al Insertar Salida", err));
      });
    }); 
  }

  cambiarStatus(folio: number, estatus: boolean) {
    return this.isReady()
    .then(() => {
        this.database.executeSql(`UPDATE salidaAlmacen  SET revisado = ? WHERE folio = ?`, 
          [
            estatus ? 1 : 0, 
            folio
          ]
          ).then((dato) => {
            return Promise.resolve(dato);
          })
          .catch((err)=>console.log("Error al Insertar Salida", err));
    }); 
  }

  eliminarSalidas(folio: number) { 
    return this.isReady()
    .then(() => {
        this.database.executeSql(`DELETE FROM salidaAlmacen WHERE folio = ?`, 
          [
            folio
          ]
          ).then((dato) => {
            // console.log('Cambiar Status', dato, estatus, folio);
            return Promise.resolve(dato);
          })
          .catch((err)=>console.log("Error al Insertar Salida", err));
    }); 
  }

  eliminarSalida(salida: SalidaAlmacen) { 
    return this.isReady()
    .then(() => {
        this.database.executeSql(`DELETE FROM salidaAlmacen WHERE folio = ? AND numeroFila = ?`, 
          [
            salida.folio, 
            salida.numeroFila
          ]
          ).then((dato) => {
            // console.log('Cambiar Status', dato, estatus, folio);
            return Promise.resolve(dato);
          })
          .catch((err)=>console.log("Error al Insertar Salida", err));
    }); 
  }
}