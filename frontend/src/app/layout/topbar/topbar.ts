import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
    LucideSmartphone,
    LucideSearch,
    LucideBell,
    LucideUserRound
} from '@lucide/angular';

@Component({
    selector: 'app-topbar',
    imports: [
        RouterLink,
        LucideSmartphone,
        LucideSearch,
        LucideBell,
        LucideUserRound
    ],
    templateUrl: './topbar.html',
    styleUrl: './topbar.scss'
})
export class Topbar {}