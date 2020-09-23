import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
})
export class EventosComponent implements OnInit {
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  modoSalvar = 'postEvento';
  imagemAltura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  // tslint:disable-next-line: variable-name
  bodyDeletarEvento = '';
  // tslint:disable-next-line: variable-name
  _filtroLista = '';

  constructor(
    private eventoService: EventoService
    // tslint:disable-next-line: align
    , private modalService: BsModalService
    // tslint:disable-next-line: align
    , private fb: FormBuilder
    // tslint:disable-next-line: align
    , private localeService: BsLocaleService
  ) {
    this.localeService.use('pt-br');
  }

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  // tslint:disable-next-line: typedef
  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = evento;
    this.registerForm.patchValue(evento);
  }

  // tslint:disable-next-line: typedef
  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  // tslint:disable-next-line: typedef
  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }


  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.validation();
    this.getEventos();
  }
  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }
  // tslint:disable-next-line: typedef
  alterarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  // tslint:disable-next-line: typedef
  validation() {
    this.registerForm = this.fb.group({
      // tslint:disable-next-line: new-parens
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]]
      // tslint:disable-next-line: new-parens
      , local: ['', Validators.required]
      // tslint:disable-next-line: new-parens
      , dataEvento: ['', Validators.required]
      // tslint:disable-next-line: new-parens
      , qtdPessoas: ['', [Validators.required, Validators.maxLength(120000)]]
      // tslint:disable-next-line: new-parens
      , imagemUrl: ['', Validators.required]
      // tslint:disable-next-line: new-parens
      , telefone: ['', Validators.required]
      // tslint:disable-next-line: new-parens
      , email: ['', [Validators.required, Validators.email]]
    });
  }
  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);
        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            template.hide();
            this.getEventos();
          }, error => {
            console.log(error);
          }
        );
      } else {
        this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);
        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
          }, error => {
            console.log(error);
          }
        );
      }
    }
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        template.hide();
        this.getEventos();
      }, error => {
        console.log(error);
      }
    );
  }
  // tslint:disable-next-line: typedef
  getEventos() {
    this.eventoService.getAllEvento().subscribe(
      // tslint:disable-next-line: variable-name
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
        console.log(_eventos);
      },
      (error) => {
        console.log(error);
      });
  }
}
