import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

// Importe suas rotas do arquivo de rotas

import { routes } from './app.routes'; 

// Importe os módulos que precisamos
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Provê as rotas
    provideAnimations(),   // Provê animações (bom ter)

    // Isso é o MAIS IMPORTANTE:
    // Importa os 'providers' do FormsModule (para ngModel) 
    // e HttpClientModule (para seus services)
    importProvidersFrom(FormsModule, HttpClientModule) 
  ]
};