import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
})
export class EventosComponent implements OnInit {
  _filtroLista:string;
  get filtroLista():string{
    return this._filtroLista;
  }
  set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  eventosFiltrados: any = [];
  eventos: any = [];
  imagemAltura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
 

  constructor(private http: HttpClient) {}
  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.getEventos();
  }
  filtrarEventos(filtrarPor: string): any{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== - 1
      || evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== - 1
      ||  evento.lote.toLocaleLowerCase().indexOf(filtrarPor) !== - 1
     )
  }

  // tslint:disable-next-line: typedef
  alterarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  // tslint:disable-next-line: typedef
  getEventos() {
    this.http.get('http://localhost:5000/api/values').subscribe(
      (response) => {
        this.eventos = response;
      },
      (error) => {
        console.log(error);
      });
  }
}
