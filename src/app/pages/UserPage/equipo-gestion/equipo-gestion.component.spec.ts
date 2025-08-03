import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoGestionComponent } from './equipo-gestion.component';

describe('EquipoGestionComponent', () => {
  let component: EquipoGestionComponent;
  let fixture: ComponentFixture<EquipoGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipoGestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipoGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
