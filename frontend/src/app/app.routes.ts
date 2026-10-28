import { Routes } from '@angular/router';

import { Login } from './component/login/login';
import { Clientes } from './component/clientes/clientes';
import { LayoutPrincipal } from './layout/layout-principal/layout-principal';
import { Servicos} from './component/servico/servico';
import { Ordens } from './component/ordens/ordens';
import { Aparelhos } from './component/aparelhos/aparelhos';
import { Tecnicos } from './component/tecnicos/tecnicos';
import { Agendamentos } from './component/agendamentos/agendamentos';
import { Painel } from './component/painel/painel';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: 'login',
        component: Login
    },

    {
        path: '',
        component: LayoutPrincipal,
        children: [
            {
                path: 'clientes',
                component: Clientes
            }, 
            {
                path: 'servicos',
                component: Servicos
            },
            {
                path: 'ordens',
                component: Ordens
            },
            {
                path: 'aparelhos',
                component: Aparelhos
            },
            {
                path: 'tecnicos',
                component: Tecnicos
            },{
            path: 'agendamentos',
            component: Agendamentos
        },{
                path: 'painel',
                component: Painel
            }
        ]
    }
];