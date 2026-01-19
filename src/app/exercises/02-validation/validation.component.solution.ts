import { Component, signal, computed } from '@angular/core';
import { form, FormField, required, email, minLength, validate } from '@angular/forms/signals';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="exercise-container">
      <header class="exercise-header">
        <h1>02 - Validation Deep Dive</h1>
        <p class="subtitle">Custom validators, cross-field validation, reactive dependencies</p>
      </header>

      <div class="alert alert-info">
        <strong>🎯 Learning Goals:</strong>
        <ul>
          <li>Use built-in validators (required, email, minLength, pattern)</li>
          <li>Create custom validators with <code>validate()</code></li>
          <li>Implement cross-field validation (password confirmation)</li>
          <li>Understand automatic dependency tracking</li>
        </ul>
      </div>

      <section class="exercise-section">
        <h3>📝 Registration Form</h3>

        <form (submit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              class="form-control"
              [class.error]="regForm.username().touched() && regForm.username().invalid()"
              [class.success]="regForm.username().touched() && regForm.username().valid()"
              [formField]="regForm.username"
              placeholder="Choose a username"
            />
            @if (regForm.username().touched() && regForm.username().invalid()) {
              @for (err of regForm.username().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Username is required }
                    @case ('minLength') { Username must be at least 3 characters }
                    @case ('invalidChars') { Only letters, numbers and underscore allowed }
                  }
                </div>
              }
            }
            @if (regForm.username().touched() && regForm.username().valid()) {
              <div class="field-success">Username looks good!</div>
            }
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              class="form-control"
              [class.error]="regForm.email().touched() && regForm.email().invalid()"
              [formField]="regForm.email"
              placeholder="your@email.com"
            />
            @if (regForm.email().touched() && regForm.email().invalid()) {
              @for (err of regForm.email().errors(); track err.kind) {
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
              [class.error]="regForm.password().touched() && regForm.password().invalid()"
              [formField]="regForm.password"
              placeholder="Create a password"
            />
            @if (regForm.password().value()) {
              <div class="password-strength">
                <div class="strength-bar">
                  <div
                    class="strength-fill"
                    [style.width.%]="passwordStrength().percent"
                    [style.background]="passwordStrength().color">
                  </div>
                </div>
                <span class="strength-label" [style.color]="passwordStrength().color">
                  {{ passwordStrength().label }}
                </span>
              </div>
            }
            @if (regForm.password().touched() && regForm.password().invalid()) {
              @for (err of regForm.password().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Password is required }
                    @case ('minLength') { Password must be at least 8 characters }
                    @case ('weak') { {{ err.message }} }
                  }
                </div>
              }
            }
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              class="form-control"
              [class.error]="regForm.confirmPassword().touched() && regForm.confirmPassword().invalid()"
              [class.success]="regForm.confirmPassword().touched() && regForm.confirmPassword().valid() && regForm.confirmPassword().value()"
              [formField]="regForm.confirmPassword"
              placeholder="Confirm your password"
            />
            @if (regForm.confirmPassword().touched() && regForm.confirmPassword().invalid()) {
              @for (err of regForm.confirmPassword().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Please confirm your password }
                    @case ('mismatch') { Passwords do not match }
                  }
                </div>
              }
            }
            @if (regForm.confirmPassword().touched() && regForm.confirmPassword().valid() && regForm.confirmPassword().value()) {
              <div class="field-success">Passwords match!</div>
            }
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="regForm().invalid()">
            Register
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
            <span>Custom Validator Example (click to expand)</span>
          </summary>
          <div class="hint-content">
            <div class="code-block">
<pre>// Custom validator with validate()
validate(f.username, ({{ '{' }} value {{ '}' }}) => {{ '{' }}
  const username = value();
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {{ '{' }}
  return {{ '{' }}
  kind: 'invalidChars',
      message: 'Only letters, numbers, underscore'
  {{ '}' }};
  {{ '}' }}
  return undefined; // valid
  {{ '}' }});</pre>
            </div>
          </div>
        </details>
      </section>

      <section class="exercise-section">
        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>Cross-Field Validation (click to expand)</span>
          </summary>
          <div class="hint-content">
            <div class="code-block">
<pre>// Cross-field: password confirmation
validate(f.confirmPassword, ({{ '{' }} value, valueOf {{ '}' }}) => {{ '{' }}
  const password = valueOf(f.password);  // Read OTHER field
  const confirm = value();               // Read THIS field

  if (password && confirm && password !== confirm) {{ '{' }}
  return {{ '{' }}
  kind: 'mismatch',
      message: 'Passwords do not match'
  {{ '}' }};
  {{ '}' }}
  return undefined;
  {{ '}' }});

// 🔥 MAGIC: This validator automatically re-runs
// when EITHER password OR confirmPassword changes!</pre>
            </div>
          </div>
        </details>
      </section>
    </div>
  `,
  styles: [`
    .password-strength {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .strength-bar {
      flex: 1;
      height: 6px;
      background: #e4e7eb;
      border-radius: 3px;
      overflow: hidden;
    }

    .strength-fill {
      height: 100%;
      transition: width 0.3s ease, background 0.3s ease;
    }

    .strength-label {
      font-size: 0.8rem;
      font-weight: 600;
      min-width: 80px;
    }
  `]
})
export class ValidationComponent {
  // Form Model
  protected readonly regModel = signal({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Form with validation schema
  protected readonly regForm = form(this.regModel, (f) => {
    // Username validation
    required(f.username);
    minLength(f.username, 3);
    validate(f.username, ({ value }) => {
      const username = value();
      if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
        return {
          kind: 'invalidChars',
          message: 'Only letters, numbers, underscore allowed'
        };
      }
      return undefined;
    });

    // Email validation
    required(f.email);
    email(f.email);

    // Password validation
    required(f.password);
    minLength(f.password, 8);
    validate(f.password, ({ value }) => {
      const pwd = value();
      if (pwd && pwd.length >= 8) {
        if (!/[A-Z]/.test(pwd)) {
          return { kind: 'weak', message: 'Add at least one uppercase letter' };
        }
        if (!/[0-9]/.test(pwd)) {
          return { kind: 'weak', message: 'Add at least one number' };
        }
      }
      return undefined;
    });

    // Confirm password - CROSS-FIELD VALIDATION
    required(f.confirmPassword);
    validate(f.confirmPassword, ({ value, valueOf }) => {
      const password = valueOf(f.password);
      const confirm = value();

      if (password && confirm && password !== confirm) {
        return {
          kind: 'mismatch',
          message: 'Passwords do not match'
        };
      }
      return undefined;
    });
  });

  // Password strength indicator
  protected passwordStrength = computed(() => {
    const pwd = this.regForm.password().value();
    if (!pwd) return { percent: 0, label: '', color: '#e4e7eb' };

    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (pwd.length >= 12) score += 15;
    if (/[a-z]/.test(pwd)) score += 15;
    if (/[A-Z]/.test(pwd)) score += 15;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;

    if (score < 30) return { percent: score, label: 'Weak', color: '#f03e3e' };
    if (score < 60) return { percent: score, label: 'Fair', color: '#fcc419' };
    if (score < 80) return { percent: score, label: 'Good', color: '#51cf66' };
    return { percent: 100, label: 'Strong', color: '#20c997' };
  });

  // Debug info
  protected formDebugInfo = () => {
    return JSON.stringify({
      valid: this.regForm().valid(),
      touched: this.regForm().touched(),
      username: {
        value: this.regForm.username().value(),
        valid: this.regForm.username().valid(),
        errors: this.regForm.username().errors()
      },
      password: {
        value: this.regForm.password().value() ? '***' : '',
        valid: this.regForm.password().valid(),
        errors: this.regForm.password().errors()
      },
      confirmPassword: {
        valid: this.regForm.confirmPassword().valid(),
        errors: this.regForm.confirmPassword().errors()
      }
    }, null, 2);
  };

  onSubmit() {
    console.log('Registration submitted:', this.regModel());
    alert('Registration submitted! Check console for data.');
  }
}
