import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './layout/navigation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  template: `
    <div class="app-layout">
      <aside class="sidebar">
        <app-navigation />
      </aside>
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      min-height: 100vh;
    }

    .sidebar {
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
    }

    .content {
      background: #f8f9fa;
      padding: 2rem;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .app-layout {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: relative;
        height: auto;
      }
    }
  `]
})
export class AppComponent {}
