import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvetirFechasComponent } from './convetir-fechas.component';

describe('ConvetirFechasComponent', () => {
  let component: ConvetirFechasComponent;
  let fixture: ComponentFixture<ConvetirFechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvetirFechasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvetirFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
