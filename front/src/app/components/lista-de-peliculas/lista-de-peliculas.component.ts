import { Component } from '@angular/core';
import { PeliculaService } from '../../services/pelicula.service';
import { PeliculaDto } from '../../interfaces/pelicula-dto';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-de-peliculas',
  imports: [RouterModule],
  templateUrl: './lista-de-peliculas.component.html',
  styleUrl: './lista-de-peliculas.component.css',
})
export class ListaDePeliculasComponent {
  peliculas: PeliculaDto[] = [];
  constructor(
    private servicio: PeliculaService
  ) {
    this.obtenerTodo();
  }
  
  obtenerTodo() {
    this.servicio.obtenerTodo().subscribe({
      next: (peliculas) => {
        console.log(peliculas)
        peliculas.forEach((item) => {        
        item.poster = this.servicio.baseUrl + item.id + '/posters?t='+ this.obtenerTimeStamp();
        });        
        this.peliculas = peliculas.filter(x=> x.visto == false)
      },
      error: (errod) => {
        console.log(errod);
        alert('Valio pepino');
      },
    });
  }

  /**
   * OBtiene el timeStamp, para que angular detecte que es una url diferente y sea forzado a cargar la imagen
   * @returns timeStamp
   */
  obtenerTimeStamp() {
    return new Date().getTime();
  }

  marcarComoVista(peliculaId: number){
    this.servicio.marcarComoVista(peliculaId).subscribe({
      next:(data)=>{
        this.obtenerTodo()
      }
    })
  }
}
