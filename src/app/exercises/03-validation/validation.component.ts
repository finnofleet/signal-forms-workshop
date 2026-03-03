/*
 * ================================================================
 * 🎯 EXERCISE GOAL: Validation - Built-in and Cross-Field
 * ================================================================
 * You will learn:
 * - How to use built-in validators (required, email, minLength)
 * - How to implement cross-field validation (password confirmation)
 * - How to understand automatic dependency tracking
 *
 * ✅ DONE WHEN:
 * - Username is required (min 3 characters)
 * - Password requires min 8 characters
 * - confirmPassword checks match with password
 * - All errors display properly
 *
 * ⏱️ TIME: 8-10 minutes
 * ================================================================
 */

import { Component, signal } from '@angular/core';
import { form, FormField, required, email, minLength, maxLength, validate, REQUIRED, MIN_LENGTH, MAX_LENGTH } from '@angular/forms/signals';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="exercise-container">
      <header class="exercise-header">
        <h1>03 - Validation Deep Dive</h1>
        <p class="subtitle">Built-in validators & cross-field validation</p>
      </header>

      <section class="exercise-section">
        <h3>📝 Registration Form</h3>

        <form (submit)="onSubmit()">

          <!-- USERNAME -->
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              class="form-control"
              [class.error]="regForm.username().touched() && regForm.username().invalid()"
              [formField]="regForm.username"
              placeholder="Choose a username"
            />

            @if (regForm.username().touched() && regForm.username().invalid()) {
              @for (err of regForm.username().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Username is required }
                    @case ('minLength') { Username must be at least 3 characters }
                  }
                </div>
              }
            }
          </div>

          <!-- EMAIL -->
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

          <!-- PASSWORD -->
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

            @if (regForm.password().touched() && regForm.password().invalid()) {
              @for (err of regForm.password().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Password is required }
                    @case ('minLength') { Password must be at least 8 characters }
                  }
                </div>
              }
            }
          </div>

          <!-- CONFIRM PASSWORD -->
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              class="form-control"
              [class.error]="regForm.confirmPassword().touched() && regForm.confirmPassword().invalid()"
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
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="regForm().invalid()">
            Register
          </button>
        </form>
      </section>

      <section class="exercise-section">
        <h3>🔖 Metadata Demo (ready example)</h3>

        <div class="alert alert-info">
          <strong>How it works:</strong> Validators automatically expose metadata about their constraints.
          You can read it <strong>before</strong> the user makes any mistake — proactive hints!
        </div>

        <form>
          <div class="form-group">
            <label class="metadata-label">
              Display Name
              @if (metaForm.displayName().metadata(REQUIRED)?.()) {
                <span class="required-badge">*</span>
              }
              <small class="metadata-hint">
                {{ metaForm.displayName().metadata(MIN_LENGTH)?.() }}–{{ metaForm.displayName().metadata(MAX_LENGTH)?.() }} characters
              </small>
            </label>
            <input
              type="text"
              class="form-control"
              [class.error]="metaForm.displayName().touched() && metaForm.displayName().invalid()"
              [formField]="metaForm.displayName"
              placeholder="Enter display name"
            />
            @if (metaForm.displayName().touched() && metaForm.displayName().invalid()) {
              @for (err of metaForm.displayName().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Display name is required }
                    @case ('minLength') { Too short }
                    @case ('maxLength') { Too long }
                  }
                </div>
              }
            }
          </div>

          <div class="form-group">
            <label class="metadata-label">
              Bio
              <small class="metadata-hint">
                max {{ metaForm.bio().metadata(MAX_LENGTH)?.() }} characters
              </small>
            </label>
            <textarea
              class="form-control"
              [class.error]="metaForm.bio().touched() && metaForm.bio().invalid()"
              [formField]="metaForm.bio"
              placeholder="Tell us about yourself"
              rows="3">
            </textarea>
            <div class="char-counter" [class.over]="metaForm.bio().value().length > (metaForm.bio().metadata(MAX_LENGTH)?.() ?? 0)">
              {{ metaForm.bio().value().length }} / {{ metaForm.bio().metadata(MAX_LENGTH)?.() }}
            </div>
          </div>
        </form>

        <div class="metadata-debug">
          <h4>Metadata values (live)</h4>
          <table class="metadata-table">
            <tr>
              <th>Field</th>
              <th>REQUIRED</th>
              <th>MIN_LENGTH</th>
              <th>MAX_LENGTH</th>
            </tr>
            <tr>
              <td>displayName</td>
              <td>{{ metaForm.displayName().metadata(REQUIRED)?.() }}</td>
              <td>{{ metaForm.displayName().metadata(MIN_LENGTH)?.() ?? '—' }}</td>
              <td>{{ metaForm.displayName().metadata(MAX_LENGTH)?.() ?? '—' }}</td>
            </tr>
            <tr>
              <td>bio</td>
              <td>{{ metaForm.bio().metadata(REQUIRED)?.() ?? '—' }}</td>
              <td>{{ metaForm.bio().metadata(MIN_LENGTH)?.() ?? '—' }}</td>
              <td>{{ metaForm.bio().metadata(MAX_LENGTH)?.() ?? '—' }}</td>
            </tr>
          </table>
        </div>

        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>Metadata API (click to expand)</span>
          </summary>
          <div class="hint-content">
            <div class="code-block">
<pre>import &#123; REQUIRED, MIN_LENGTH, MAX_LENGTH &#125; from '&#64;angular/forms/signals';

// Validators automatically set metadata:
required(f.displayName);          // sets REQUIRED = true
minLength(f.displayName, 3);      // sets MIN_LENGTH = 3
maxLength(f.displayName, 20);     // sets MAX_LENGTH = 20

// Read metadata — works BEFORE user types anything:
form.displayName().metadata(REQUIRED)     // Signal&lt;boolean&gt; → true
form.displayName().metadata(MIN_LENGTH)   // Signal&lt;number&gt; → 3
form.displayName().metadata(MAX_LENGTH)   // Signal&lt;number&gt; → 20

// In template — proactive hints, no waiting for errors:
&lt;label&gt;
  Display Name
  &#64;if (form.displayName().metadata(REQUIRED)?.()) &#123;
    &lt;span class="required-badge"&gt;*&lt;/span&gt;
  &#125;
  &lt;small&gt;
    {{ '{{' }} form.displayName().metadata(MIN_LENGTH)?.() {{ '}}' }} chars
  &lt;/small&gt;
&lt;/label&gt;</pre>
            </div>
          </div>
        </details>
      </section>
    </div>
  `,
  styles: [`
    .metadata-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .required-badge {
      color: #f03e3e;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .metadata-hint {
      color: #868e96;
      font-weight: 400;
      font-size: 0.8rem;
    }

    .char-counter {
      font-size: 0.8rem;
      color: #868e96;
      text-align: right;
      margin-top: 0.25rem;

      &.over {
        color: #f03e3e;
        font-weight: 600;
      }
    }

    .metadata-debug {
      margin-top: 1.5rem;

      h4 {
        margin: 0 0 0.5rem 0;
        font-size: 0.9rem;
        color: #495057;
      }
    }

    .metadata-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;

      th, td {
        padding: 0.5rem 0.75rem;
        border: 1px solid #e4e7eb;
        text-align: center;
      }

      th {
        background: #f1f3f5;
        font-weight: 600;
        color: #495057;
      }

      td:first-child {
        text-align: left;
        font-weight: 500;
        font-family: 'Fira Code', monospace;
        font-size: 0.8rem;
      }
    }
  `]
})
export class ValidationComponent {

  protected readonly regModel = signal({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // TODO 1: Add validation for each field
  // Username: required, min 3 characters
  // Email: required, must be valid email format
  // Password: required, min 8 characters
  // Confirm password: required, must match password (cross-field validation)
  protected readonly regForm = form(this.regModel, (f) => {
    // Add validation here
  });

  // ---- Metadata Demo (ready example) ----
  protected readonly REQUIRED = REQUIRED;
  protected readonly MIN_LENGTH = MIN_LENGTH;
  protected readonly MAX_LENGTH = MAX_LENGTH;

  private readonly metaModel = signal({
    displayName: '',
    bio: ''
  });

  protected readonly metaForm = form(this.metaModel, (f) => {
    required(f.displayName);
    minLength(f.displayName, 3);
    maxLength(f.displayName, 20);
    maxLength(f.bio, 140);
  });

  protected formDebugInfo = (): string => {
    return JSON.stringify(this.regForm(), null, 2);
  };

  onSubmit() {
    console.log('Registration submitted:', this.regModel());
    alert('Registration submitted! Check console for data.');
  }
}
