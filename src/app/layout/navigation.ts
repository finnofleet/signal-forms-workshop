import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  path: string;
  label: string;
  badge: string;
  badgeClass: string;
  description: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="workshop-nav">
      <div class="nav-header">
        <h1>🔥 Signal Forms Workshop</h1>
        <div class="badges">
          <span class="badge experimental">EXPERIMENTAL</span>
          <span class="badge version">Angular 21.1</span>
        </div>
      </div>

      <div class="nav-links">
        @for (item of navItems; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="active"
            class="nav-item">
            <div class="nav-item-header">
              <span class="badge" [class]="item.badgeClass">{{ item.badge }}</span>
              <span class="label">{{ item.label }}</span>
            </div>
            <p class="description">{{ item.description }}</p>
          </a>
        }
      </div>

      <div class="nav-footer">
        <p>API: <code>signal-forms-workshop-api.matestefanczyk.workers.dev</code></p>
      </div>
    </nav>
  `,
  styles: [`
    .workshop-nav {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      padding: 1.5rem;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .nav-header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-header h1 {
      margin: 0 0 0.75rem 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .badges {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge.experimental {
      background: #ff6b6b;
      color: white;
    }

    .badge.version {
      background: #4ecdc4;
      color: #1a1a2e;
    }

    .badge.basics {
      background: #51cf66;
      color: white;
    }

    .badge.validation {
      background: #ffd43b;
      color: #1a1a2e;
    }

    .badge.schemas {
      background: #ff922b;
      color: white;
    }

    .badge.controls {
      background: #845ef7;
      color: white;
    }

    .badge.async {
      background: #f03e3e;
      color: white;
    }

    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
    }

    .nav-item {
      display: block;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      text-decoration: none;
      color: white;
      transition: all 0.2s ease;
      border: 2px solid transparent;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }

    .nav-item.active {
      background: rgba(78, 205, 196, 0.2);
      border-color: #4ecdc4;
    }

    .nav-item-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .label {
      font-weight: 600;
      font-size: 1rem;
    }

    .description {
      margin: 0;
      font-size: 0.8rem;
      opacity: 0.7;
      line-height: 1.4;
    }

    .nav-footer {
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.75rem;
      opacity: 0.6;
    }

    .nav-footer code {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-size: 0.7rem;
    }
  `]
})
export class NavigationComponent {
  navItems: NavItem[] = [
    {
      path: '/a-basics',
      label: 'Basics',
      badge: 'A',
      badgeClass: 'basics',
      description: 'form(), [formField], Field State'
    },
    {
      path: '/b-validations-submit',
      label: 'Validations & Submit',
      badge: 'B',
      badgeClass: 'validation',
      description: 'Built-in validators, custom validators, submit()'
    },
    {
      path: '/c-dynamic-forms',
      label: 'Dynamic Forms',
      badge: 'C',
      badgeClass: 'schemas',
      description: 'Arrays, linkedSignal, conditional logic'
    },
    {
      path: '/d-custom-controls',
      label: 'Custom Controls',
      badge: 'D',
      badgeClass: 'controls',
      description: 'FormValueControl, FormCheckboxControl, FieldTree'
    }
  ];
}
