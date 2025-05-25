import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConditionTermsComponent } from './modal-condition-terms.component';

describe('ModalConditionTermsComponent', () => {
  let component: ModalConditionTermsComponent;
  let fixture: ComponentFixture<ModalConditionTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalConditionTermsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConditionTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
