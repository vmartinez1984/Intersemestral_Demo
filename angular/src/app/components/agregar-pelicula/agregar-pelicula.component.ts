import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PeliculaDtoIn } from '../../interfaces/pelicula-dto';
import { PeliculaService } from '../../services/pelicula.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-pelicula',
  imports: [ReactiveFormsModule],
  templateUrl: './agregar-pelicula.component.html',
  styleUrl: './agregar-pelicula.component.css',
})
export class AgregarPeliculaComponent {
  formGroup: FormGroup;
  poster?: File;
  imagenEnBase64?: string;

  constructor(
    private formBuilder: FormBuilder,
    private service: PeliculaService,
    private router: Router
  ) {
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
    console.log(this.formGroup.value);
    if (this.formGroup.valid) {
      //console.log('Valido');
      let pelicula: PeliculaDtoIn = this.formGroup.value    
      pelicula.poster = this.poster  
      console.log(pelicula)
      this.service.agregar(pelicula).subscribe({
        next:(data)=>{
          console.log(data)
          this.router.navigate(['/']);
        },
        error:(data)=>{
          console.log(data)
        }
      })
    }
  }
}
