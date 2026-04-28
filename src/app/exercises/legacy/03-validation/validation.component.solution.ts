import { Component, signal } from '@angular/core';
import { form, FormField, required, email, minLength, validate } from '@angular/forms/signals';

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
                  }
                </div>
              }
            }

            @if (regForm.username().touched() && regForm.username().valid()) {
              <div class="field-success">Username looks good!</div>
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

            @if (
              regForm.confirmPassword().touched() &&
              regForm.confirmPassword().valid() &&
              regForm.confirmPassword().value()
              ) {
              <div class="field-success">Passwords match!</div>
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="regForm().invalid()"
          >
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
    </div>
  `
})
export class ValidationComponent {

  protected readonly regModel = signal({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  protected readonly regForm = form(this.regModel, (f) => {

    // Username
    required(f.username);
    minLength(f.username, 3);

    // Email
    required(f.email);
    email(f.email);

    // Password
    required(f.password);
    minLength(f.password, 8);

    // Confirm password (cross-field)
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
