import { Routes } from '@angular/router';
import { Login } from './component/login/login';

export const routes: Routes = [
    {
        path:'',redirectTo:'login',pathMatch:'full'
    },
    {
        path:'login',component:Login
    }
];
