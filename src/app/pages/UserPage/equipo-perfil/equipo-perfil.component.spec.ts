import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoPerfilComponent } from './equipo-perfil.component';

describe('EquipoPerfilComponent', () => {
  let component: EquipoPerfilComponent;
  let fixture: ComponentFixture<EquipoPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipoPerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipoPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
