import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './Pages/navbar/navbar';
import { Footer } from './Pages/footer/footer';
@Component({
  imports: [RouterOutlet,Navbar,Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('postDemo');
}
