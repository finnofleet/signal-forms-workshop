import { Component, signal } from '@angular/core';
import { form, FormField, required, email } from '@angular/forms/signals';

@Component({
  selector: 'app-basics',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="exercise-container">
      <header class="exercise-header">
        <h1>01 - Signal Forms Basics</h1>
        <p class="subtitle">Learn form(), [formField], and Field State</p>
      </header>

      <div class="alert alert-info">
        <strong>🎯 Learning Goals:</strong>
        <ul style="margin: 0.5rem 0 0 1.5rem; padding: 0;">
          <li>Create a form model with <code>signal()</code></li>
          <li>Initialize form with <code>form()</code></li>
          <li>Bind inputs with <code>[formField]</code></li>
          <li>Access field state (value, errors, touched, valid)</li>
        </ul>
      </div>

      <section class="exercise-section">
        <h3>📝 Login Form</h3>

        <form (submit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              class="form-control"
              [class.error]="loginForm.email().touched() && loginForm.email().invalid()"
              [formField]="loginForm.email"
              placeholder="your@email.com"
            />
            @if (loginForm.email().touched() && loginForm.email().invalid()) {
              @for (err of loginForm.email().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Email is required }
                    @case ('email') { Please enter a valid email }
                  }
                </div>
              }
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              class="form-control"
              [class.error]="loginForm.password().touched() && loginForm.password().invalid()"
              [formField]="loginForm.password"
              placeholder="Enter password"
            />
            @if (loginForm.password().touched() && loginForm.password().invalid()) {
              @for (err of loginForm.password().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Password is required }
                  }
                </div>
              }
            }
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="loginForm().invalid()">
            Login
          </button>
        </form>
      </section>

      <section class="exercise-section">
        <h3>🔍 Form State (Debug)</h3>
        <div class="code-block">
          <pre>{{ formDebugInfo() }}</pre>
        </div>
      </section>

      <section class="exercise-section">
        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>Key Concepts (click to expand)</span>
          </summary>
          <div class="hint-content">
            <div class="code-block">
<pre>// 1. Model (signal)
loginModel = signal({{ '{' }} email: '', password: '' {{ '}' }});

// 2. Form with validation
loginForm = form(this.loginModel, (f) => {{ '{' }}
  required(f.email);
  email(f.email);
  required(f.password);
{{ '}' }});

// 3. Access values
this.loginForm.email().value()     // current value
this.loginForm.email().valid()     // boolean
this.loginForm.email().touched()   // boolean
this.loginForm.email().errors()    // ValidationError[]</pre>
            </div>
          </div>
        </details>
      </section>
    </div>
  `,
  styles: [`
    .hint-details {
      border: 2px dashed #e4e7eb;
      border-radius: 8px;
      overflow: hidden;
    }

    .hint-summary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      cursor: pointer;
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
      transition: background 0.2s ease;

      &:hover {
        background: #e9ecef;
      }

      &::marker {
        content: '';
      }
    }

    .hint-icon {
      font-size: 1.25rem;
    }

    .hint-details[open] .hint-summary {
      border-bottom: 2px dashed #e4e7eb;
    }

    .hint-content {
      padding: 1rem;
      animation: fadeIn 0.3s ease;
    }

    .hint-content .code-block {
      margin: 0;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class BasicsComponent {
  // 1. Form Model
  protected readonly loginModel = signal({
    email: '',
    password: ''
  });

  // 2. Form with validation schema
  protected readonly loginForm = form(this.loginModel, (f) => {
    required(f.email);
    email(f.email);
    required(f.password);
  });

  // Debug info
  protected formDebugInfo = () => {
    return JSON.stringify({
      value: this.loginForm().value(),
      valid: this.loginForm().valid(),
      invalid: this.loginForm().invalid(),
      touched: this.loginForm().touched(),
      dirty: this.loginForm().dirty(),
      email: {
        value: this.loginForm.email().value(),
        valid: this.loginForm.email().valid(),
        touched: this.loginForm.email().touched(),
        errors: this.loginForm.email().errors()
      },
      password: {
        value: this.loginForm.password().value(),
        valid: this.loginForm.password().valid(),
        touched: this.loginForm.password().touched(),
        errors: this.loginForm.password().errors()
      }
    }, null, 2);
  };

  onSubmit() {
    console.log('Form submitted:', this.loginModel());
    alert('Form submitted! Check console for data.');
  }
}
