import { Component, signal, inject, linkedSignal } from '@angular/core';
import { form, FormField, required, email, disabled, submit } from '@angular/forms/signals';
import { rxResource } from '@angular/core/rxjs-interop';
import { ApiService } from '../../shared/services/api.service';
import { User } from '../../shared/models/api.models';
import { firstValueFrom } from 'rxjs';
import { JsonPipe } from '@angular/common';

// ============================================
// Domain ↔ Form Model Types
// ============================================

interface UserFormModel {
  displayName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
}

const EMPTY_FORM: UserFormModel = {
  displayName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  postalCode: ''
};

function domainToForm(user: User): UserFormModel {
  return {
    displayName: user.name,
    email: user.email,
    phone: user.phone ?? '',
    street: user.address?.street ?? '',
    city: user.address?.city ?? '',
    postalCode: user.address?.postalCode ?? '',
  };
}

function formToDomain(formData: UserFormModel): Partial<User> {
  return {
    name: formData.displayName,
    email: formData.email,
    phone: formData.phone,
    address: {
      street: formData.street,
      city: formData.city,
      postalCode: formData.postalCode,
    }
  };
}

@Component({
  selector: 'app-model-design',
  standalone: true,
  imports: [FormField, JsonPipe],
  template: `
    <div class="exercise-container">
      <header class="exercise-header">
        <h1>07 - Form Model Design</h1>
        <p class="subtitle">Domain ↔ Form model separation, linkedSignal, httpResource</p>
      </header>

      <div class="alert alert-info">
        <strong>🎯 Learning Goals:</strong>
        <ul>
          <li>Separate domain model (API) from form model (UI)</li>
          <li>Use <code>linkedSignal</code> to derive form model from API data</li>
          <li>Use <code>rxResource</code> to load user from API</li>
          <li>Transform between models with helper functions</li>
          <li>Use <code>disabled()</code> while data loads</li>
        </ul>
      </div>

      <div class="alert alert-warning">
        <strong>🌐 Live API:</strong> Loading user from
        <code>GET /api/users/user-1</code>
      </div>

      @if (userResource.isLoading()) {
        <div class="loading-banner">
          <span class="loading-spinner"></span>
          Loading user profile...
        </div>
      }

      <section class="exercise-section">
        <h3>📝 User Profile Editor</h3>

        <form (submit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label for="displayName">Display Name</label>
              <input
                id="displayName"
                type="text"
                class="form-control"
                [class.error]="profileForm.displayName().touched() && profileForm.displayName().invalid()"
                [formField]="profileForm.displayName"
                placeholder="Your display name"
              />
              @if (profileForm.displayName().touched() && profileForm.displayName().invalid()) {
                @for (err of profileForm.displayName().errors(); track err.kind) {
                  <div class="field-error">
                    @switch (err.kind) {
                      @case ('required') { Display name is required }
                      @default { {{ err.message || 'Invalid' }} }
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
                [class.error]="profileForm.email().touched() && profileForm.email().invalid()"
                [formField]="profileForm.email"
                placeholder="your@email.com"
              />
              @if (profileForm.email().touched() && profileForm.email().invalid()) {
                @for (err of profileForm.email().errors(); track err.kind) {
                  <div class="field-error">
                    @switch (err.kind) {
                      @case ('required') { Email is required }
                      @case ('email') { Please enter a valid email }
                      @default { {{ err.message || 'Invalid' }} }
                    }
                  </div>
                }
              }
            </div>
          </div>

          <div class="form-group">
            <label for="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              class="form-control"
              [formField]="profileForm.phone"
              placeholder="+1 234 567 890"
            />
          </div>

          <h4>Address</h4>

          <div class="form-group">
            <label for="street">Street</label>
            <input
              id="street"
              type="text"
              class="form-control"
              [formField]="profileForm.street"
              placeholder="123 Main St"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="city">City</label>
              <input
                id="city"
                type="text"
                class="form-control"
                [formField]="profileForm.city"
                placeholder="New York"
              />
            </div>

            <div class="form-group">
              <label for="postalCode">Postal Code</label>
              <input
                id="postalCode"
                type="text"
                class="form-control"
                [formField]="profileForm.postalCode"
                placeholder="10001"
              />
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="profileForm().invalid() || profileForm().submitting() || userResource.isLoading()">
            @if (profileForm().submitting()) {
              <span class="loading-spinner"></span>
              Saving...
            } @else {
              Save Profile
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
        <h3>🔍 Debug Info</h3>
        <div class="debug-grid">
          <div class="debug-card">
            <h4>Domain Model (API)</h4>
            <pre class="code-block">{{ userResource.value() | json }}</pre>
          </div>
          <div class="debug-card">
            <h4>Form Model (UI)</h4>
            <pre class="code-block">{{ profileForm().value() | json }}</pre>
          </div>
        </div>
        <div class="state-grid">
          <div class="state-item">
            <span class="label">Valid</span>
            <span class="value" [class.yes]="profileForm().valid()">{{ profileForm().valid() ? 'Yes' : 'No' }}</span>
          </div>
          <div class="state-item">
            <span class="label">Dirty</span>
            <span class="value" [class.yes]="profileForm().dirty()">{{ profileForm().dirty() ? 'Yes' : 'No' }}</span>
          </div>
          <div class="state-item">
            <span class="label">Loading</span>
            <span class="value" [class.yes]="userResource.isLoading()">{{ userResource.isLoading() ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .loading-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #e7f5ff;
      border: 1px solid #339af0;
      border-radius: 8px;
      margin-bottom: 1rem;
      color: #1864ab;
      font-weight: 500;
    }

    .debug-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .debug-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;

      h4 {
        margin: 0 0 0.5rem;
        font-size: 0.85rem;
        color: #495057;
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
      font-size: 0.8rem;
      line-height: 1.5;
      margin: 0;
    }
  `]
})
export class ModelDesignComponent {
  private readonly api = inject(ApiService);

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  // Load user from API with rxResource
  protected readonly userResource = rxResource({
    stream: () => this.api.getUser('user-1')
  });

  // Derive form model from API resource using linkedSignal
  protected readonly formModel = linkedSignal(() => {
    const user = this.userResource.value();
    return user ? domainToForm(user) : EMPTY_FORM;
  });

  // Form with validation + disabled while loading
  protected readonly profileForm = form(this.formModel, (f) => {
    required(f.displayName);
    required(f.email);
    email(f.email);

    // Disable entire form while API data is loading
    disabled(f, () => this.userResource.isLoading());
  });

  async onSubmit() {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    await submit(this.profileForm, async (formTree) => {
      try {
        const formData = formTree().value();
        const domainData = formToDomain(formData);

        const response = await firstValueFrom(
          this.api.updateUser('user-1', domainData)
        );

        if (response.success) {
          this.successMessage.set('Profile updated successfully!');
        } else if (response.errors) {
          this.errorMessage.set('Failed to update profile.');
          return response.errors.map(err => ({
            kind: err.code.toLowerCase(),
            path: err.field,
            message: err.message
          }));
        }

        return null;
      } catch (error) {
        this.errorMessage.set('Failed to update profile. Please try again.');
        return null;
      }
    });
  }
}
