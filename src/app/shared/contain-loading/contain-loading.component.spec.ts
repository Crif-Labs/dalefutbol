import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainLoadingComponent } from './contain-loading.component';

describe('ContainLoadingComponent', () => {
  let component: ContainLoadingComponent;
  let fixture: ComponentFixture<ContainLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
