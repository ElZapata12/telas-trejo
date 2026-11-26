import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

export interface Config {
    nombreTerminal: string;
    mensajeTicket: string;
    umbralStockBajo: number;

}


export interface ItemCarrito{
    tela: number;
    nombre: string;
    precio_rollo: number;
    rollos: number;

}

@Injectable({ providedIn: 'root'})
export class StorageService {
    private cookieService = inject(CookieService);
    private readonly LLAVE_CONFIG ='tt_config';
    private readonly LLAVE_CARRITO = 'tt_carrito';
    private readonly LLAVE_TOKEN = 'tt_token';

    private readonly CONFIG_DEFECTO: Config = {
        nombreTerminal: 'Terminal Mérida',
        mensajeTicket: 'Gracias por su compra en Telas Trejo',
        umbralStockBajo: 5,

    };

    //En este punto es donde agregamos los metodos de el 'loogeo' de cuenta. 
    //En este metodo configuramos tiempo que caduca sola en 1 día para no dejar la sesión abierta; viaja en Authorization entre Vercel y Render..
    guardarToken(token: string): void {
        this.cookieService.set(this.LLAVE_TOKEN, token, {
            expires: 1,
            path: '/',
            secure: environment.production,
            sameSite: 'Strict',
        });
    }

    //En este se lee el inicio de sesion
    leerToken(): string {
        return this.cookieService.get(this.LLAVE_TOKEN);
    }

    //Para este se revisa si el token sigue activo dentro de la cookie
    borrarToken(): void {
        this.cookieService.delete(this.LLAVE_TOKEN, '/');
    }

    // Guardamos la configuracion desde un nuevo dispositivo  en el localstorage
    // se agregan ahi por que son preferencias no sensibles.
    guardarConfig(config: Config): void {
        localStorage.setItem(this.LLAVE_CONFIG, JSON.stringify(config));
    }

    // Muestra la configuracion que definimos anteriormente como formato json
    leerConfig(): Config {
        const config = localStorage.getItem(this.LLAVE_CONFIG);
        if (!config) return { ...this.CONFIG_DEFECTO };
        try {
            return { ...this.CONFIG_DEFECTO, ...JSON.parse(config) };
        } catch{
            return{ ...this.CONFIG_DEFECTO };
        }
    }

    // En este se guardan los articulos que desemos dentro del carrito 
    // incluso si este recarga la pagina
    guardarCarrito(item: ItemCarrito[]): void {
        sessionStorage.setItem(this.LLAVE_CARRITO, JSON.stringify(item));
    }

    // Revia lo guardado en el carrito mediante un arreglo
    leerCarrito(): ItemCarrito[] {
        const guardado = sessionStorage.getItem(this.LLAVE_CARRITO);
        if (!guardado) return [];
        try {
            const datos = JSON.parse(guardado);
            return Array.isArray(datos) ? datos : [];
        } catch {
            return [];
        }

    }

    // Vacia el carrito al cerrar la pestaña o cerrar sesion
    limpiarCarrito(): void {
        sessionStorage.removeItem(this.LLAVE_CARRITO);
    }


}




