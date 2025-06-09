import { Component } from '@angular/core';
import { PeliculaDto } from '../../interfaces/pelicula-dto';
import { PeliculaService } from '../../services/pelicula.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-de-peliculas-vistas',
  imports: [RouterModule],
  templateUrl: './lista-de-peliculas-vistas.component.html',
  styleUrl: './lista-de-peliculas-vistas.component.css'
})
export class ListaDePeliculasVistasComponent {
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
        item.poster = this.servicio.baseUrl + item.id + '/posters';
        });
        this.peliculas = peliculas.filter(x=> x.visto == true)
      },
      error: (errod) => {
        console.log(errod);
        alert('Valio pepino');
      },
    });
  }

  desmarcarComoVista(peliculaId: number){
    this.servicio.desmarcarComoVista(peliculaId).subscribe({
      next:(data)=>{
        this.obtenerTodo()
      }
    })
  }
}
