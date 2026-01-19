import { Component, signal, inject } from '@angular/core';
import { form, FormField, required, email, minLength, debounce, submit, validateHttp } from '@angular/forms/signals';
import { ApiService } from '../../shared/services/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-async-submit',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="exercise-container">
      <header class="exercise-header">
        <h1>05 - Async Validation & Submit</h1>
        <p class="subtitle">Real API integration, debounce, submit() with server errors</p>
      </header>

      <div class="alert alert-info">
        <strong>🎯 Learning Goals:</strong>
        <ul>
          <li>Async validation with real API calls</li>
          <li>Use <code>debounce()</code> for rate limiting</li>
          <li>Handle <code>pending()</code> state in UI</li>
          <li>Use <code>submit()</code> with server error mapping</li>
        </ul>
      </div>

      <div class="alert alert-warning">
        <strong>🌐 Live API:</strong> This exercise uses a real API at
        <code>signal-forms-workshop-api.matestefanczyk.workers.dev</code>
      </div>

      <section class="exercise-section">
        <h3>📝 Registration with Async Validation</h3>

        <form (submit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <div class="input-with-status">
              <input
                id="username"
                type="text"
                class="form-control"
                [class.error]="regForm.username().touched() && regForm.username().invalid()"
                [class.success]="regForm.username().touched() && regForm.username().valid() && !regForm.username().pending()"
                [formField]="regForm.username"
                placeholder="Choose a username"
              />
              @if (regForm.username().pending()) {
                <span class="status-icon pending">
                  <span class="loading-spinner"></span>
                </span>
              } @else if (regForm.username().touched() && regForm.username().valid()) {
                <span class="status-icon success">✓</span>
              } @else if (regForm.username().touched() && regForm.username().invalid()) {
                <span class="status-icon error">✗</span>
              }
            </div>
            @if (regForm.username().touched() && regForm.username().invalid() && !regForm.username().pending()) {
              @for (err of regForm.username().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Username is required }
                    @case ('minLength') { Username must be at least 3 characters }
                    @case ('taken') { {{ err.message }} }
                    @default { {{ err.message || 'Invalid username' }} }
                  }
                </div>
              }
              @if (usernameSuggestions().length > 0) {
                <div class="suggestions">
                  <span>Try:</span>
                  @for (suggestion of usernameSuggestions(); track suggestion) {
                    <button type="button" class="suggestion-btn" (click)="useSuggestion(suggestion)">
                      {{ suggestion }}
                    </button>
                  }
                </div>
              }
            }
            @if (regForm.username().touched() && regForm.username().valid() && !regForm.username().pending()) {
              <div class="field-success">Username is available!</div>
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
                    @case ('taken') { This email is already registered }
                    @default { {{ err.message || 'Invalid email' }} }
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
              placeholder="Create a password (min 8 characters)"
            />
            @if (regForm.password().touched() && regForm.password().invalid()) {
              @for (err of regForm.password().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Password is required }
                    @case ('minLength') { Password must be at least 8 characters }
                    @default { {{ err.message || 'Invalid password' }} }
                  }
                </div>
              }
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="regForm().invalid() || regForm().pending() || regForm().submitting()">
            @if (regForm().submitting()) {
              <span class="loading-spinner"></span>
              Registering...
            } @else if (regForm().pending()) {
              Validating...
            } @else {
              Register
            }
          </button>
        </form>
      </section>

      @if (successMessage()) {
        <div class="alert alert-success">
          <strong>🎉 Success!</strong> {{ successMessage() }}
        </div>
      }

      @if (errorMessage()) {
        <div class="alert alert-error">
          <strong>❌ Error:</strong> {{ errorMessage() }}
        </div>
      }

      <section class="exercise-section">
        <h3>🔍 Form State</h3>
        <div class="state-grid">
          <div class="state-item">
            <span class="label">Valid</span>
            <span class="value" [class.yes]="regForm().valid()">{{ regForm().valid() ? 'Yes' : 'No' }}</span>
          </div>
          <div class="state-item">
            <span class="label">Pending</span>
            <span class="value" [class.yes]="regForm().pending()">{{ regForm().pending() ? 'Yes' : 'No' }}</span>
          </div>
          <div class="state-item">
            <span class="label">Submitting</span>
            <span class="value" [class.yes]="regForm().submitting()">{{ regForm().submitting() ? 'Yes' : 'No' }}</span>
          </div>
          <div class="state-item">
            <span class="label">Touched</span>
            <span class="value">{{ regForm().touched() ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </section>

      <section class="exercise-section">
        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>Async Validation Pattern (click to expand)</span>
          </summary>
          <div class="hint-content">
            <pre class="code-block">// Async validation with validateHttp()
debounce(f.username, 400);

validateHttp(f.username, &#123;
  request: (&#123; value &#125;) =&gt;
    \`/api/auth/check-username?username=\$&#123;value()&#125;\`,
  onSuccess: (response) =&gt; &#123;
    if (!response.available) &#123;
      return &#123;
        kind: 'taken',
        message: 'Username is taken'
      &#125;;
    &#125;
    return null;
  &#125;,
  onError: () =&gt; (&#123;
    kind: 'networkError',
    message: 'Could not verify username'
  &#125;)
&#125;);</pre>
          </div>
        </details>
      </section>

      <section class="exercise-section">
        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>submit() with ApiService (click to expand)</span>
          </summary>
          <div class="hint-content">
            <pre class="code-block">async onSubmit() &#123;
  await submit(this.regForm, async (form) =&gt; &#123;
    // Use ApiService for submit
    const response = await firstValueFrom(
      this.api.register(form().value())
    );

    if (!response.success &amp;&amp; response.errors) &#123;
      // Map server errors to form fields
      return response.errors.map(err =&gt; (&#123;
        kind: err.code,
        path: err.field,
        message: err.message
      &#125;));
    &#125;

    return null; // Success
  &#125;);
&#125;</pre>
          </div>
        </details>
      </section>
    </div>
  `,
  styles: [`
    .input-with-status {
      position: relative;
    }

    .input-with-status input {
      padding-right: 40px;
    }

    .status-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1rem;
      font-weight: 600;

      &.pending { color: #868e96; }
      &.success { color: #51cf66; }
      &.error { color: #f03e3e; }
    }

    .suggestions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: #495057;
    }

    .suggestion-btn {
      background: #e7f5ff;
      border: 1px solid #339af0;
      color: #1864ab;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
        background: #d0ebff;
      }
    }

    .state-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 1rem;
    }

    .state-item {
      text-align: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;

      .label {
        display: block;
        font-size: 0.75rem;
        color: #6c757d;
        text-transform: uppercase;
        margin-bottom: 0.25rem;
      }

      .value {
        font-weight: 600;
        color: #868e96;

        &.yes { color: #51cf66; }
      }
    }

    .code-block {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'Fira Code', monospace;
      font-size: 0.85rem;
      line-height: 1.5;
    }
  `]
})
export class AsyncSubmitComponent {
  private readonly api = inject(ApiService);

  private readonly API_BASE = 'https://signal-forms-workshop-api.matestefanczyk.workers.dev';

  // State
  protected readonly usernameSuggestions = signal<string[]>([]);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  // Form Model
  protected readonly regModel = signal({
    username: '',
    email: '',
    password: ''
  });

  // Form with async validation
  protected readonly regForm = form(this.regModel, (f) => {
    // Username validation
    required(f.username);
    minLength(f.username, 3);
    debounce(f.username, 400);

    // Async username check using validateHttp()
    // Note: validateHttp requires URL string, so we can't use ApiService here directly
    // But we handle the response including suggestions
    validateHttp(f.username, {
      request: ({ value }) => {
        const username = value();
        return `${this.API_BASE}/api/auth/check-username?username=${encodeURIComponent(username)}`;
      },
      onSuccess: (response:
                  { available: boolean; message?: string; suggestions?: string[] }) => {
        if (!response.available) {
          return {
            kind: 'taken',
            message: response.message || 'Username is already taken'
          };
        }
        return null;
      },
      onError: () => ({
        kind: 'error',
        message: 'Could not check username availability'
      })
    });

    // Email validation
    required(f.email);
    email(f.email);

    // Password validation
    required(f.password);
    minLength(f.password, 8);
  });

  useSuggestion(suggestion: string) {
    this.regModel.update(m => ({ ...m, username: suggestion }));
  }

  async onSubmit() {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    await submit(this.regForm, async (formTree) => {
      try {
        // Use ApiService for registration
        const response = await firstValueFrom(
          this.api.register(formTree().value())
        );

        if (response.success) {
          this.successMessage.set(`Registration successful! User ID: ${response.id}`);
          return null;
        }

        // Map server errors to form fields
        // Structure must be: { kind, path?, message? }
        if (response.errors) {
          this.errorMessage.set('Please fix the errors below');
          return response.errors.map(err => ({
            kind: err.code.toLowerCase(),
            path: err.field,
            message: err.message
          }));
        }

        return null;
      } catch (error: any) {
        this.errorMessage.set(error.message || 'Registration failed. Please try again.');
        return null;
      }
    });
  }
}
