import {Component, inject, resource, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {
  debounce,
  email,
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  pattern,
  required,
  validate,
  validateAsync,
  validateHttp,
} from '@angular/forms/signals';
import {ApiService} from '../../../shared/services/api.service';

const API_BASE = 'https://signal-forms-workshop-api.matestefanczyk.workers.dev';

@Component({
  selector: 'app-b-validators-submit',
  standalone: true,
  imports: [FormField, FormRoot, JsonPipe],
  templateUrl: './b-validators-submit.component.solution.html',
  styleUrl: '../b-validators-submit.component.css'
})
export class BValidatorsSubmitSolutionComponent {
  private readonly api = inject(ApiService);

  protected readonly successMessage = signal<string | null>(null);

  protected readonly regModel = signal({
    username:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
  });

  protected readonly regForm = form(this.regModel, (f) => {

    // ── Part A: Built-in validators ──────────────────────────────────────────

    required(f.username);
    minLength(f.username, 3);
    maxLength(f.username, 20);
    // This custom error requires extending the template switch-case
    pattern(f.username, /^[a-zA-Z0-9_]+$/, {
      error: {
        kind: "invalidChars",
        message: 'Only letters, numbers, underscore allowed'
      }
    });

    required(f.email);
    email(f.email);

    required(f.password);
    minLength(f.password, 8);

    required(f.confirmPassword);

    // ── Part B: Custom validators ────────────────────────────────────────────

    validate(f.password, ({ value }) => {
      const v = value();
      const strong = /[A-Z]/.test(v) && /[0-9]/.test(v) && /[!@#$%^&*]/.test(v) && !/[\s_-]/.test(v);
      return strong ? null : {
        kind: 'passwordStrength',
        message: 'Need uppercase, number, and special char (!@#$%^&*). Must NOT contain whitespaces, underscore (_) or dashes (-)'
      };
    });

    validate(f.confirmPassword, ({ value, valueOf }) => {
      return value() !== valueOf(f.password)
        ? { kind: 'mismatch', message: 'Passwords do not match' }
        : null;
    });

    // ── Part C: Async validation ─────────────────────────────────────────────

    debounce(f.username, 400);

    validateHttp(f.username, {
      request: ({ value }) => `${API_BASE}/api/auth/check-username?username=${encodeURIComponent(value())}`,
      onSuccess: (res: { available: boolean }) => res.available ? null : { kind: 'taken', message: 'Username is already taken' },
      onError: () => ({ kind: 'networkError', message: 'Could not verify username — try again' }),
    });

    debounce(f.email, 400);

    validateAsync(f.email, {
      params: ({ value }) => value(),
      factory: (params) => resource({
        params,
        loader: async ({ params: emailValue }) => {
          await new Promise(r => setTimeout(r, 800)); // simulate network latency
          const BANNED = ['banned.com', 'spam.org', 'throwaway.io'];
          const domain = emailValue?.split('@')[1] ?? '';
          return BANNED.includes(domain) ? true : null;
        },
      }),
      onSuccess: (banned) => banned
        ? { kind: 'bannedDomain', message: 'Email domain is not allowed' }
        : null,
      onError: () => ({ kind: 'domainCheckError', message: 'Could not verify email domain — try again' }),
    });
  },
  // ── Part C: Submit ───────────────────────────────────────────────────────────
  {
    submission: {
      action: async (form) => {
        await new Promise(r => setTimeout(r, 1500)); // simulate API request
        this.successMessage.set(`Welcome, ${this.regModel().username}!`);
        form().reset({ username: '', email: '', password: '', confirmPassword: '' });
        // null = success, return ValidationError | ValidationError[] to map server errors from API call to fields
        return null;
      }
    }
  });
}
