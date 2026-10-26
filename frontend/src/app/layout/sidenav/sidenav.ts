import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
    LucideUsersRound,
    LucideWrench,
    LucideClipboardList,
    LucideMonitor,
    LucideUserRound,
    LucideCalendarDays,
    LucideLayoutDashboard,
    LucideSettings,
    LucideCircleHelp
} from '@lucide/angular';

@Component({
    selector: 'app-side-nav',
    imports: [
        RouterLink,
        RouterLinkActive,
        LucideUsersRound,
        LucideWrench,
        LucideClipboardList,
        LucideMonitor,
        LucideUserRound,
        LucideCalendarDays,
        LucideLayoutDashboard,
        LucideSettings,
        LucideCircleHelp
    ],
    templateUrl: './sidenav.html',
    styleUrl: './sidenav.scss'
})
export class SideNav {}