import { Routes } from '@angular/router';
import { ListaDePeliculasComponent } from './components/lista-de-peliculas/lista-de-peliculas.component';
import { DetallesPeliculaComponent } from './components/detalles-pelicula/detalles-pelicula.component';
import { AgregarPeliculaComponent } from './components/agregar-pelicula/agregar-pelicula.component';
import { EditarPeliculaComponent } from './components/editar-pelicula/editar-pelicula.component';
import { ListaDePeliculasVistasComponent } from './components/lista-de-peliculas-vistas/lista-de-peliculas-vistas.component';

export const routes: Routes = [
  { path: '', component: ListaDePeliculasComponent },
  { path: 'vistas', component: ListaDePeliculasVistasComponent },
  { path: 'detalles/:id', component: DetallesPeliculaComponent },
  { path: 'agregar', component: AgregarPeliculaComponent },
  { path: 'editar/:id', component: EditarPeliculaComponent },
];
