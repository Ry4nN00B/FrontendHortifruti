import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // IMPORTAR

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // ADICIONAR
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'hortifruti-frontend';
}