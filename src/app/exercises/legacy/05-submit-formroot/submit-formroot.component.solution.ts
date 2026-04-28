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
  templateUrl: './submit-formroot.component.solution.html',
  styleUrl: './submit-formroot.component.solution.scss'
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
