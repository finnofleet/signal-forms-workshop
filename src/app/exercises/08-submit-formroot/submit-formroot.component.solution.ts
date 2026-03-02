import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required, email, minLength, submit } from '@angular/forms/signals';

interface ContactFormModel {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-submit-formroot',
  standalone: true,
  imports: [FormField, FormRoot],
  template: `
    <div class="exercise-container">
      <header class="exercise-header">
        <h1>08 - Submit & FormRoot</h1>
        <p class="subtitle">Advanced submit(), error summary, FormRoot directive</p>
      </header>

      <div class="alert alert-info">
        <strong>🎯 Learning Goals:</strong>
        <ul>
          <li>Use <code>submit()</code> with options object</li>
          <li>Collect errors with <code>errorSummary()</code></li>
          <li>Auto-focus invalid fields with <code>focusBoundControl()</code></li>
          <li>Use <code>[formRoot]</code> for declarative submit</li>
          <li>Show <code>submitting()</code> loading state</li>
          <li>Use <code>reset()</code> after success</li>
        </ul>
      </div>

      @if (formErrors().length > 0) {
        <div class="alert alert-error">
          <strong>❌ Please fix the following errors:</strong>
          <ul>
            @for (err of formErrors(); track $index) {
              <li>{{ err.message || err.kind }}</li>
            }
          </ul>
        </div>
      }

      @if (successMessage()) {
        <div class="alert alert-success">
          <strong>🎉 Success!</strong> {{ successMessage() }}
        </div>
      }

      <section class="exercise-section">
        <h3>📝 Contact Form</h3>

        <form [formRoot]="contactForm" (formSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Name</label>
            <input
              id="name"
              type="text"
              class="form-control"
              [class.error]="contactForm.name().touched() && contactForm.name().invalid()"
              [formField]="contactForm.name"
              placeholder="Your name"
            />
            @if (contactForm.name().touched() && contactForm.name().invalid()) {
              @for (err of contactForm.name().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Name is required }
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
              [class.error]="contactForm.email().touched() && contactForm.email().invalid()"
              [formField]="contactForm.email"
              placeholder="your@email.com"
            />
            @if (contactForm.email().touched() && contactForm.email().invalid()) {
              @for (err of contactForm.email().errors(); track err.kind) {
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

          <div class="form-group">
            <label for="subject">Subject</label>
            <input
              id="subject"
              type="text"
              class="form-control"
              [class.error]="contactForm.subject().touched() && contactForm.subject().invalid()"
              [formField]="contactForm.subject"
              placeholder="What is this about?"
            />
            @if (contactForm.subject().touched() && contactForm.subject().invalid()) {
              @for (err of contactForm.subject().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Subject is required }
                    @case ('minLength') { Subject must be at least 5 characters }
                    @default { {{ err.message || 'Invalid' }} }
                  }
                </div>
              }
            }
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea
              id="message"
              class="form-control"
              rows="4"
              [class.error]="contactForm.message().touched() && contactForm.message().invalid()"
              [formField]="contactForm.message"
              placeholder="Your message..."
            ></textarea>
            @if (contactForm.message().touched() && contactForm.message().invalid()) {
              @for (err of contactForm.message().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Message is required }
                    @case ('minLength') { Message must be at least 20 characters }
                    @default { {{ err.message || 'Invalid' }} }
                  }
                </div>
              }
            }
          </div>

          <div class="form-group">
            <label for="priority">Priority</label>
            <select
              id="priority"
              class="form-control"
              [formField]="contactForm.priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="contactForm().submitting()">
            @if (contactForm().submitting()) {
              <span class="loading-spinner"></span>
              Sending...
            } @else {
              Send Message
            }
          </button>
        </form>
      </section>

      <section class="exercise-section">
        <h3>🔍 Form State</h3>
        <div class="state-grid">
          <div class="state-item">
            <span class="label">Valid</span>
            <span class="value" [class.yes]="contactForm().valid()">{{ contactForm().valid() ? 'Yes' : 'No' }}</span>
          </div>
          <div class="state-item">
            <span class="label">Touched</span>
            <span class="value" [class.yes]="contactForm().touched()">{{ contactForm().touched() ? 'Yes' : 'No' }}</span>
          </div>
          <div class="state-item">
            <span class="label">Submitting</span>
            <span class="value" [class.yes]="contactForm().submitting()">{{ contactForm().submitting() ? 'Yes' : 'No' }}</span>
          </div>
          <div class="state-item">
            <span class="label">Dirty</span>
            <span class="value" [class.yes]="contactForm().dirty()">{{ contactForm().dirty() ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
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

    textarea.form-control {
      resize: vertical;
      min-height: 100px;
    }
  `]
})
export class SubmitFormrootComponent {
  protected readonly formErrors = signal<any[]>([]);
  protected readonly successMessage = signal<string | null>(null);

  protected readonly contactModel = signal<ContactFormModel>({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  protected readonly contactForm = form(this.contactModel, (f) => {
    required(f.name);
    required(f.email);
    email(f.email);
    required(f.subject);
    minLength(f.subject, 5);
    required(f.message);
    minLength(f.message, 20);
  });

  async onSubmit() {
    this.formErrors.set([]);
    this.successMessage.set(null);

    await submit(this.contactForm, {
      action: async (formTree) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.successMessage.set('Message sent successfully! We will get back to you soon.');

        // Reset model after success
        this.contactModel.set({
          name: '',
          email: '',
          subject: '',
          message: '',
          priority: 'medium'
        });
        return null;
      },
      onInvalid: (formTree) => {
        // Collect errors from each field
        const errors: any[] = [];
        const fields = ['name', 'email', 'subject', 'message'] as const;
        for (const fieldName of fields) {
          const field = formTree[fieldName]();
          if (field.invalid()) {
            errors.push(...field.errors());
          }
        }
        this.formErrors.set(errors);
      }
    });
  }
}
