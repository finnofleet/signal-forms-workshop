/*
 * ================================================================
 * 🎯 EXERCISE GOAL: Signal Forms Basics
 * ================================================================
 * You will learn:
 * - How to create a form model with signal()
 * - How to initialize a form with form()
 * - How to bind inputs with [formField]
 * - How to read field state (value, errors, touched, valid)
 *
 * ✅ PART A - DONE WHEN:
 * - The form displays correctly
 * - Email and password validation works
 * - The Login button is disabled when the form is invalid
 * - Data is logged to console on Login click
 *
 * ⏱️ PART A TIME: 5-7 minutes
 *
 * ================== BONUS ==================
 *
 * 🎯 PART B - BONUS (5 min):
 * Extend the form with:
 * - Add "username" field with required + minLength(3) validation
 * - Add "rememberMe" field (boolean) with a checkbox
 * - Extend password validation with minLength(6)
 *
 * ✅ PART B - DONE WHEN:
 * - Username field validates correctly (min 3 characters)
 * - Remember Me checkbox toggles correctly
 * - Password requires at least 6 characters
 * - All fields are included in the form submission
 *
 * 💡 HINT: Check the "Key Concepts" section below!
 * ================================================================
 */

import { Component, signal } from '@angular/core';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';

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

        <form>
          <!-- PART B - BONUS: Username field -->
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              class="form-control"
              [class.error]="loginForm.username().touched() && loginForm.username().invalid()"
              [formField]="loginForm.username"
              placeholder="Enter username"
            />
            @if (loginForm.username().touched() && loginForm.username().invalid()) {
              @for (err of loginForm.username().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Username is required }
                    @case ('minLength') { Username must be at least 3 characters }
                  }
                </div>
              }
            }
          </div>

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
                    @case ('minLength') { Password must be at least 6 characters }
                  }
                </div>
              }
            }
          </div>

          <!-- PART B - BONUS: Remember Me checkbox -->
          <div class="form-group">
            <label class="checkbox-wrapper">
              <input
                type="checkbox"
                [checked]="loginForm.rememberMe().value()"
                (change)="toggleRememberMe()"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button type="button" (click)="onSubmit()" class="btn btn-primary" [disabled]="loginForm().invalid()">
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

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;

      input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      span {
        user-select: none;
      }
    }
  `]
})
export class BasicsComponent {
  // Form model — already set up with signal()
  // Notice how the form data structure matches the template fields
  protected readonly loginModel = signal({
    username: '',
    email: '',
    password: '',
    rememberMe: false,
  });

  // TODO 2: Create form with validation using form(model, schemaFn)
  // Look at the template to understand which fields need validation and what error kinds are expected
  // PART B BONUS: add validation for the bonus fields too
  protected readonly loginForm = form(this.loginModel, (f) => {
    // Add validation here
  });

  // TODO 3: Return a debug string showing the current form state
  // Explore what properties are available on this.loginForm() and its fields
  protected formDebugInfo = (): string => {
    return JSON.stringify({}, null, 2);
  };

  onSubmit() {
    console.log('Form submitted:', this.loginModel());
    alert('Form submitted! Check console for data.');
  }

  toggleRememberMe() {
    this.loginModel.update(m => ({ ...m, rememberMe: !m.rememberMe }));
  }
}
