import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PeliculaDto, PeliculaDtoIn } from '../interfaces/pelicula-dto';

@Injectable({
  providedIn: 'root',
})
export class PeliculaService {
  desmarcarComoVista(peliculaId: number) {
    return this.httpClient.put(this.baseUrl + peliculaId + "/novisto", null)
  }
  
  marcarComoVista(peliculaId: number): Observable<any> {
    return this.httpClient.put(this.baseUrl + peliculaId + "/visto", null)
  }

  private obtenerFormData(pelicula: PeliculaDtoIn): FormData {
    const formData = new FormData();
    formData.append('titulo', pelicula.titulo);
    formData.append('resumen', pelicula.resumen!);
    if (pelicula.poster)
      formData.append('poster', pelicula.poster);

    return formData;
  }

  agregar(pelicula: PeliculaDtoIn): Observable<any> {
    const formData = this.obtenerFormData(pelicula);
    return this.httpClient.post<any>(this.baseUrl, formData);
  }

  actualizar(peliculaId: number, pelicula: PeliculaDtoIn): Observable<any> {
    const formData = this.obtenerFormData(pelicula);
    return this.httpClient.put(this.baseUrl + peliculaId, formData);
  }

  obtenerPorId(id: string | null): Observable<PeliculaDto> {
    return this.httpClient.get<PeliculaDto>(this.baseUrl + id);
  }

  baseUrl = 'http://localhost:3000/api/peliculas/';
  //baseUrl = 'https://localhost:44322/api/v2/Peliculas/';
  //baseUrl = 'https://utilidades.vmartinez84.xyz/api/v2/Peliculas/'

  constructor(private httpClient: HttpClient) { }

  obtenerTodo(): Observable<PeliculaDto[]> {
    return this.httpClient.get<PeliculaDto[]>(this.baseUrl);
  }
}
