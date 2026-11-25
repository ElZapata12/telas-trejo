import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Login } from './pages/login/login';
import { Resumen } from './pages/resumen/resumen';
import { PuntoVenta } from './pages/punto-venta/punto-venta';
import { Pedidos } from './pages/pedidos/pedidos';
import { Clientes } from './pages/clientes/clientes';
import { Rastreo } from './pages/rastreo/rastreo';
import { Finanzas } from './pages/finanzas/finanzas';
import { Recibos } from './pages/recibos/recibos';
import { Inventario } from './pages/inventario/inventario';
import { RecuperarTicket } from './pages/recuperar-ticket/recuperar-ticket';
import { Configuracion } from './pages/configuracion/configuracion';

export const routes: Routes = [
    { path: 'login', component:  Login },
    {
        path: '',
        component: Layout,
        children: [
                { path: 'resumen', component: Resumen},
                { path: 'punto-venta', component: PuntoVenta},
                { path: 'pedidos', component: Pedidos},
                { path: 'clientes', component: Clientes},
                { path: 'rastreo', component: Rastreo},
                { path: 'finanzas', component: Finanzas},
                { path: 'recibos', component: Recibos},
                { path: 'inventario', component: Inventario},
                { path: 'recuperar-ticket', component: RecuperarTicket},
                { path: 'configuracion', component: Configuracion}
        ],
    },

    {path: '**', redirectTo: 'resumen' },
    {path: '', redirectTo: 'resumen', pathMatch: 'full'}

];
