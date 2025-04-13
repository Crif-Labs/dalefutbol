import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiPartidoComponent } from './mi-partido.component';

describe('MiPartidoComponent', () => {
  let component: MiPartidoComponent;
  let fixture: ComponentFixture<MiPartidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiPartidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiPartidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
