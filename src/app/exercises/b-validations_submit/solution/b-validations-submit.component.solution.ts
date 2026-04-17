import { Component, signal } from '@angular/core';
import {
  form, FormField,
  required, email, minLength, maxLength,
  validate, debounce, validateHttp, submit,
} from '@angular/forms/signals';

const API_BASE = 'https://signal-forms-workshop-api.matestefanczyk.workers.dev';

@Component({
  selector: 'app-b-validations-submit-solution',
  standalone: true,
  imports: [FormField],
  templateUrl: './b-validations-submit.component.solution.html',
  styleUrl: '../b-validations-submit.component.css'
})
export class BValidationsSubmitSolutionComponent {

  protected readonly successMessage = signal<string | null>(null);

  protected readonly regModel = signal({
    username:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
  });

  protected readonly regForm = form(this.regModel, (f) => {
    // Part A: built-in validators
    required(f.username);
    minLength(f.username, 3);
    maxLength(f.username, 20);

    required(f.email);
    email(f.email);

    required(f.password);
    minLength(f.password, 8);

    required(f.confirmPassword);

    // Part B: custom validators
    validate(f.password, ({ value }) => {
      const v = value();
      const strong = /[A-Z]/.test(v) && /[0-9]/.test(v) && /[!@#$%^&*]/.test(v);
      return strong
        ? null
        : { kind: 'passwordStrength', message: 'Need uppercase, number, and special char (!@#$%^&*)' };
    });

    validate(f.confirmPassword, ({ value, valueOf }) =>
      value() !== valueOf(f.password)
        ? { kind: 'mismatch', message: 'Passwords do not match' }
        : null
    );

    // Part C: async validation
    debounce(f.username, 400);

    validateHttp(f.username, {
      request: ({ value }) =>
        `${API_BASE}/api/auth/check-username?username=${encodeURIComponent(value())}`,
      onSuccess: (res: { available: boolean }) =>
        res.available ? null : { kind: 'taken', message: 'Username is already taken' },
      onError: () => ({ kind: 'networkError', message: 'Could not verify username — try again' }),
    });
  });

  async onSubmit(): Promise<void> {
    this.successMessage.set(null);
    await submit(this.regForm, async () => {
      await new Promise(r => setTimeout(r, 1500));
      this.successMessage.set(`Welcome, ${this.regModel().username}! Your account has been created.`);
      this.regModel.set({ username: '', email: '', password: '', confirmPassword: '' });
      return null;
    });
  }
}
