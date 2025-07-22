import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSolicitudesComponent } from './modal-solicitudes.component';

describe('ModalSolicitudesComponent', () => {
  let component: ModalSolicitudesComponent;
  let fixture: ComponentFixture<ModalSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSolicitudesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
