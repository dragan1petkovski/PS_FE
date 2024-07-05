import { Component } from '@angular/core';
import { LoginComponent } from './loginPage/login.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [LoginComponent, RouterOutlet, RouterLink],
})
export class AppComponent {
}
