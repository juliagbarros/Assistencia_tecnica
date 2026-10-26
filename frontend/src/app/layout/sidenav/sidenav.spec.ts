import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNav } from './sidenav';

describe('Sidenav', () => {
  let component: SideNav;
  let fixture: ComponentFixture<SideNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNav],
    }).compileComponents();

    fixture = TestBed.createComponent(SideNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
