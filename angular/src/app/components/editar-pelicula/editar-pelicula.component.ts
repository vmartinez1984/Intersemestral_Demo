import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PeliculaService } from '../../services/pelicula.service';
import { PeliculaDto, PeliculaDtoIn } from '../../interfaces/pelicula-dto';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-editar-pelicula',
  imports: [ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './editar-pelicula.component.html',
  styleUrl: './editar-pelicula.component.css',
})
export class EditarPeliculaComponent {
  pelicula?: PeliculaDto;
  formGroup: FormGroup;
  poster?: File;
  imagenEnBase64: string = '';
  trailer: string = '';

  constructor(
    private activateRoute: ActivatedRoute,
    private servicio: PeliculaService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    let id = this.activateRoute.snapshot.paramMap.get('id');
    this.obtenerPorId(id);
    this.formGroup = this.formBuilder.group({
      titulo: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        },
      ],
      resumen: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(1024),
          ],
        },
      ],
      poster: [''],
      trailer: [''],
    });
  }

  obtenerPorId(id: string | null) {
    this.servicio.obtenerPorId(id).subscribe({
      next: (data) => {
        this.pelicula = data;
        //this.trailer = data.trailer;
        console.log(data);

        this.pelicula.poster =
          this.servicio.baseUrl + this.pelicula.id + '/posters';

        this.formGroup.patchValue({
          titulo: this.pelicula.titulo,
          resumen: this.pelicula.resumen,
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  toBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  visualizarImagen(event: any) {
    if (event.target.files.length > 0) {
      if (event.target.files[0]) {
        this.poster = event.target.files[0];
        this.toBase64(event.target.files[0]).then((value) => {
          this.imagenEnBase64 = value + '';
        });
      }
      //this.imagenEnBase64 = '';
    }
  }

  guardar() {
    if (this.formGroup.valid) {
      let peliculaDotIn: PeliculaDtoIn = {
        resumen: this.formGroup.value.resumen,
        titulo: this.formGroup.value.titulo
      };
      if(this.poster)
        peliculaDotIn.poster = this.poster
      console.log(peliculaDotIn);
      this.servicio.actualizar(this.pelicula!.id, peliculaDotIn).subscribe({
        next: (data) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
}
