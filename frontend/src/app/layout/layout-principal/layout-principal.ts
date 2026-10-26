import { Component } from '@angular/core';
import { Topbar } from '../topbar/topbar';

import { RouterOutlet } from '@angular/router';
import { SideNav } from '../sidenav/sidenav';

@Component({
  selector: 'app-layout-principal',
  imports: [Topbar, SideNav, RouterOutlet],
  templateUrl: './layout-principal.html',
  styleUrl: './layout-principal.scss',
})
export class LayoutPrincipal {}
