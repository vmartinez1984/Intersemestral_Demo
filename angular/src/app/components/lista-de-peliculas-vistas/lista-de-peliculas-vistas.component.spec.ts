import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDePeliculasVistasComponent } from './lista-de-peliculas-vistas.component';

describe('ListaDePeliculasVistasComponent', () => {
  let component: ListaDePeliculasVistasComponent;
  let fixture: ComponentFixture<ListaDePeliculasVistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaDePeliculasVistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaDePeliculasVistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
