import { SafeResourceUrl } from '@angular/platform-browser';

export interface PeliculaDto {
  id: number;
  titulo: string;
  resumen: string; 
  poster: string;
  visto: boolean;
}

export interface PeliculaDtoIn {
  titulo: string;
  resumen: string;
  poster?: File | null;
}
