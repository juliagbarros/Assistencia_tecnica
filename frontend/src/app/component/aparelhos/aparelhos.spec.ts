import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aparelhos } from './aparelhos';

describe('Aparelhos', () => {
  let component: Aparelhos;
  let fixture: ComponentFixture<Aparelhos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aparelhos],
    }).compileComponents();

    fixture = TestBed.createComponent(Aparelhos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
