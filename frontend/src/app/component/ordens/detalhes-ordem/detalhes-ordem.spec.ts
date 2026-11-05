import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesOrdem } from './detalhes-ordem';

describe('DetalhesOrdem', () => {
  let component: DetalhesOrdem;
  let fixture: ComponentFixture<DetalhesOrdem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesOrdem],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesOrdem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
