import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  baseUrl = 'http://localhost:5000/api/evento';

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  getAllEvento(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseUrl);
  }

  getEventoByTrma(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/getByTema/${tema}`);
  }

  getEventoById(id: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/${id}`);
  }

  // tslint:disable-next-line: typedef
  postUpload(file: File, name: string) {
    const fileToUpload = <File> file[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, name);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  // tslint:disable-next-line: typedef
  postEvento(evento: Evento) {
    return this.http.post(this.baseUrl, evento);
  }

  // tslint:disable-next-line: typedef
  putEvento(evento: Evento) {
    return this.http.put(`${this.baseUrl}/${evento.id}`, evento);
  }

  deleteEvento(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
