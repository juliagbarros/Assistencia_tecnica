import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioServico } from './formulario-servico';

describe('FormularioServico', () => {
  let component: FormularioServico;
  let fixture: ComponentFixture<FormularioServico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioServico],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioServico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
