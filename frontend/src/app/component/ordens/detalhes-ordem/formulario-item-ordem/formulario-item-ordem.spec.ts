import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioItemOrdem } from './formulario-item-ordem';

describe('FormularioItemOrdem', () => {
  let component: FormularioItemOrdem;
  let fixture: ComponentFixture<FormularioItemOrdem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioItemOrdem],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioItemOrdem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
