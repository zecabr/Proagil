import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { EventoService } from 'src/app/_services/evento.service';
import { Evento } from 'src/app/_models/Evento';
import { ActivatedRoute } from '@angular/router';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-eventoEdit',
  templateUrl: './eventoEdit.component.html',
  styleUrls: ['./eventoEdit.component.css']
})
export class EventoEditComponent implements OnInit {

  titulo = 'Editar Evento';
  evento: Evento = new Evento();
  imagemURL = 'assets/img/upload.png';
  registerForm: FormGroup;
  file: File;
  fileNameToUpdate: string;
  dataAtual = '';

  get lotes(): FormArray {
    return <FormArray>this.registerForm.get('lotes');
  }

  get redesSociais(): FormArray {
    return <FormArray>this.registerForm.get('redesSociais');
  }


  constructor(
    private eventoService: EventoService
    // tslint:disable-next-line: align
    , private fb: FormBuilder
    // tslint:disable-next-line: align
    , private localeService: BsLocaleService
    // tslint:disable-next-line: align
    , private toastr: ToastrService
    // tslint:disable-next-line: align
    , private router: ActivatedRoute
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.validation();
    this.carregarEvento();
  }
  carregarEvento() {
    const idEvento = +this.router.snapshot.paramMap.get('id');
    this.dataAtual = new Date().getMilliseconds().toString();
    this.eventoService.getEventoById(idEvento)
      .subscribe(
        (evento: Evento) => {
          this.evento = Object.assign({}, evento);
          this.fileNameToUpdate = evento.imagemUrl.toString();
          this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemUrl}?_ts=${this.dataAtual}`;
          this.evento.imagemUrl = '';
          this.registerForm.patchValue(this.evento);

          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criarLote(lote));
          });

          this.evento.redesSociais.forEach(redeSocial => {
            this.redesSociais.push(this.criarRedesSociais(redeSocial));
          });

        }
      );
  }

  validation() {
    this.registerForm = this.fb.group({
      id: [],
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemUrl: [''],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([]),
      redesSociais: this.fb.array([])
    });
  }

  // tslint:disable-next-line: typedef
  onFileChange(evento: any, file: FileList) {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = evento.target.files;

    reader.readAsDataURL(file[0]);
  }

  // tslint:disable-next-line: typedef
  criarLote(lote: any) {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]
    });
  }

  // tslint:disable-next-line: typedef
  criarRedesSociais(redeSocial: any) {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required]
    });
  }

  // tslint:disable-next-line: typedef
  adicionarLote() {
    this.lotes.push(this.criarLote({ id: 0 }));
  }
  // tslint:disable-next-line: typedef
  adicionarRedeSocial() {
    this.redesSociais.push(this.criarRedesSociais({ id: 0 }));
  }

  // tslint:disable-next-line: typedef
  removerLote(id: number) {
    this.lotes.removeAt(id);
  }
  // tslint:disable-next-line: typedef
  removerRedeSocial(id: number) {
    this.redesSociais.removeAt(id);
  }

  salvarEvento() {
    this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);
    this.evento.imagemUrl = this.fileNameToUpdate;

    this.uploadImagem();

    this.eventoService.putEvento(this.evento).subscribe(
      () => {
        this.toastr.success('Editado com Sucesso!');
      }, error => {
        this.toastr.error(`Erro ao Editar: ${error}`);
      }
    );
  }

  uploadImagem() {
    if (this.registerForm.get('imagemUrl').value !== '') {
      this.eventoService.postUpload(this.file, this.fileNameToUpdate)
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemUrl}?_ts=${this.dataAtual}`;
          }
        );
    }
  }
}
