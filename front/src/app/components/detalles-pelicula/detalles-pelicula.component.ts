import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PeliculaService } from '../../services/pelicula.service';
import { PeliculaDto, PeliculaDtoIn } from '../../interfaces/pelicula-dto';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detalles-pelicula',
  imports: [],
  templateUrl: './detalles-pelicula.component.html',
  styleUrl: './detalles-pelicula.component.css',
})
export class DetallesPeliculaComponent {
  pelicula: PeliculaDto= {
    titulo:'',        
    id:0,    
    poster:'',
    visto: false,
    resumen:'',        
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private servicio: PeliculaService,
    private sanitizer: DomSanitizer
  ) {
    let id = this.activateRoute.snapshot.paramMap.get('id');
    this.obtenerPorId(id);
  }

  marcarComoVista() {   
    //console.log(this.pelicula);
    let peliculaDotIn: PeliculaDtoIn = {
      resumen: this.pelicula?.resumen,
      titulo: this.pelicula.titulo,    
    };
    console.log(peliculaDotIn);
    this.servicio.actualizar(this.pelicula!.id, peliculaDotIn).subscribe({
      next: (data) => {
        this.router.navigate(['']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  obtenerPorId(id: string | null) {
    this.servicio.obtenerPorId(id).subscribe({
      next: (data) => {
        this.pelicula = data;
        console.log(data)        
      },
    });
  }

  obtenerUrlYoutubeEmbebed(url: any): SafeResourceUrl {
    if (!url) {
      return '';
    }

    var video_id = url.split('v=')[1];
    var posisionAmpersan = video_id.indexOf('&');
    if (posisionAmpersan !== -1) {
      video_id = video_id.substring(0, posisionAmpersan);
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${video_id}`
    );
  }
}
