/*
 * ================================================================
 * 🎯 EXERCISE GOAL: Subforms with FieldTree
 * ================================================================
 * You will learn:
 * - Pass FieldTree<T> as input() to child components
 * - Single form state across multiple components
 * - Validation stays in parent schema, UI in children
 * - schema() for reusable validation of each section
 *
 * ✅ DONE WHEN:
 * - 3 child components render their form sections
 * - All fields bind to the parent form state
 * - Validation errors show in child components
 * - Submit in parent collects everything
 *
 * ⏱️ TIME: 12-15 minutes
 *
 * 💡 HINT: FieldTree is the key — pass it as input()!
 * ================================================================
 */

import { Component, signal, input } from '@angular/core';
import { form, FormField, FieldTree, required, email, minLength, maxLength, schema, apply, submit } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';

// ============================================
// Form Model
// ============================================

interface BookingFormModel {
  passenger: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  flight: {
    from: string;
    to: string;
    date: string;
    class: 'economy' | 'business';
  };
  payment: {
    cardNumber: string;
    expMonth: string;
    expYear: string;
    cvv: string;
  };
}

// ============================================
// TODO 1: Create PassengerFormComponent
// ============================================
// - Receives FieldTree<BookingFormModel['passenger']> as input
// - Renders firstName, lastName, email, phone fields
// - Uses [formField] to bind to parent form state

@Component({
  selector: 'app-passenger-form',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="subform-card">
      <h4>👤 Passenger Details</h4>
      <!-- TODO 1a: Add form fields bound to passenger FieldTree -->
      <!-- Example:
      <div class="form-row">
        <div class="form-group">
          <label>First Name</label>
          <input
            type="text"
            class="form-control"
            [formField]="passenger().firstName"
            placeholder="First name"
          />
          @if (passenger().firstName().touched() && passenger().firstName().invalid()) {
            @for (err of passenger().firstName().errors(); track err.kind) {
              <div class="field-error">First name is required</div>
            }
          }
        </div>
        ... more fields
      </div>
      -->
      <p class="todo-placeholder">TODO: Implement passenger form fields</p>
    </div>
  `
})
export class PassengerFormComponent {
  // TODO 1b: Declare input for FieldTree
  // readonly passenger = input.required<FieldTree<BookingFormModel['passenger']>>();
  readonly passenger = input.required<any>();
}

// ============================================
// TODO 2: Create FlightFormComponent
// ============================================

@Component({
  selector: 'app-flight-form',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="subform-card">
      <h4>✈️ Flight Details</h4>
      <!-- TODO 2a: Add from, to, date, class fields -->
      <p class="todo-placeholder">TODO: Implement flight form fields</p>
    </div>
  `
})
export class FlightFormComponent {
  // TODO 2b: Declare input for FieldTree
  readonly flight = input.required<any>();
}

// ============================================
// TODO 3: Create PaymentFormComponent
// ============================================

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="subform-card">
      <h4>💳 Payment Details</h4>
      <!-- TODO 3a: Add cardNumber, expMonth, expYear, cvv fields -->
      <p class="todo-placeholder">TODO: Implement payment form fields</p>
    </div>
  `
})
export class PaymentFormComponent {
  // TODO 3b: Declare input for FieldTree
  readonly payment = input.required<any>();
}

// ============================================
// Parent Component
// ============================================

@Component({
  selector: 'app-subforms',
  standalone: true,
  imports: [PassengerFormComponent, FlightFormComponent, PaymentFormComponent, JsonPipe],
  template: `
    <div class="exercise-container">
      <header class="exercise-header">
        <h1>09 - Subforms with FieldTree</h1>
        <p class="subtitle">Split forms across child components with shared state</p>
      </header>

      <div class="alert alert-info">
        <strong>🎯 Learning Goals:</strong>
        <ul>
          <li>Pass <code>FieldTree&lt;T&gt;</code> as <code>input()</code> to children</li>
          <li>Single form state across multiple components</li>
          <li>Validation in parent, UI in children</li>
          <li>Use <code>schema()</code> for section validation</li>
        </ul>
      </div>

      <section class="exercise-section">
        <h3>📝 Flight Booking</h3>

        <form (submit)="onSubmit()">
          <!-- TODO 4: Pass FieldTree portions to child components -->
          <!-- <app-passenger-form [passenger]="bookingForm.passenger" /> -->
          <!-- <app-flight-form [flight]="bookingForm.flight" /> -->
          <!-- <app-payment-form [payment]="bookingForm.payment" /> -->

          <app-passenger-form [passenger]="bookingForm.passenger" />
          <app-flight-form [flight]="bookingForm.flight" />
          <app-payment-form [payment]="bookingForm.payment" />

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="bookingForm().invalid() || bookingForm().submitting()">
            @if (bookingForm().submitting()) {
              <span class="loading-spinner"></span>
              Booking...
            } @else {
              Book Flight
            }
          </button>
        </form>
      </section>

      @if (successMessage()) {
        <div class="alert alert-success">
          <strong>🎉 Success!</strong> {{ successMessage() }}
        </div>
      }

      <section class="exercise-section">
        <h3>🔍 Complete Form State</h3>
        <pre class="code-block">{{ bookingForm().value() | json }}</pre>
        <div class="state-grid">
          <div class="state-item">
            <span class="label">Valid</span>
            <span class="value" [class.yes]="bookingForm().valid()">{{ bookingForm().valid() ? 'Yes' : 'No' }}</span>
          </div>
          <div class="state-item">
            <span class="label">Touched</span>
            <span class="value" [class.yes]="bookingForm().touched()">{{ bookingForm().touched() ? 'Yes' : 'No' }}</span>
          </div>
          <div class="state-item">
            <span class="label">Dirty</span>
            <span class="value" [class.yes]="bookingForm().dirty()">{{ bookingForm().dirty() ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </section>

      <section class="exercise-section">
        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>FieldTree input pattern (click to expand)</span>
          </summary>
          <div class="hint-content">
            <pre class="code-block">// Child component receives a portion of the form tree
&#64;Component(&#123; ... &#125;)
export class PassengerFormComponent &#123;
  readonly passenger = input.required&lt;
    FieldTree&lt;BookingFormModel['passenger']&gt;
  &gt;();
&#125;

// Parent passes it:
&lt;app-passenger-form
  [passenger]="bookingForm.passenger" /&gt;

// Child binds fields:
&lt;input [formField]="passenger().firstName" /&gt;</pre>
          </div>
        </details>
      </section>

      <section class="exercise-section">
        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>schema() for section validation (click to expand)</span>
          </summary>
          <div class="hint-content">
            <pre class="code-block">// Define reusable schemas per section
const passengerSchema = schema&lt;BookingFormModel['passenger']&gt;((f) =&gt; &#123;
  required(f.firstName);
  required(f.lastName);
  required(f.email);
  email(f.email);
&#125;);

// Apply in parent form
bookingForm = form(this.model, (f) =&gt; &#123;
  apply(f.passenger, passengerSchema);
  apply(f.flight, flightSchema);
  apply(f.payment, paymentSchema);
&#125;);</pre>
          </div>
        </details>
      </section>
    </div>
  `,
  styles: [`
    .subform-card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;

      h4 {
        margin: 0 0 1rem;
        font-size: 1.1rem;
      }
    }

    .todo-placeholder {
      color: #868e96;
      font-style: italic;
      padding: 1rem;
      background: #fff3bf;
      border-radius: 4px;
      text-align: center;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .state-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
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
    }
  `]
})
export class SubformsComponent {
  protected readonly successMessage = signal<string | null>(null);

  protected readonly bookingModel = signal<BookingFormModel>({
    passenger: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    flight: {
      from: '',
      to: '',
      date: '',
      class: 'economy'
    },
    payment: {
      cardNumber: '',
      expMonth: '',
      expYear: '',
      cvv: ''
    }
  });

  // TODO 5: Create form with validation schema using schema() for each section
  protected readonly bookingForm = form(this.bookingModel, (f) => {
    // TODO 5a: Passenger validation
    // const passengerSchema = schema<BookingFormModel['passenger']>((p) => {
    //   required(p.firstName);
    //   required(p.lastName);
    //   required(p.email);
    //   email(p.email);
    // });
    // apply(f.passenger, passengerSchema);

    // TODO 5b: Flight validation
    // const flightSchema = schema<BookingFormModel['flight']>((fl) => {
    //   required(fl.from);
    //   required(fl.to);
    //   required(fl.date);
    // });
    // apply(f.flight, flightSchema);

    // TODO 5c: Payment validation
    // const paymentSchema = schema<BookingFormModel['payment']>((p) => {
    //   required(p.cardNumber);
    //   minLength(p.cardNumber, 16);
    //   maxLength(p.cardNumber, 16);
    //   required(p.expMonth);
    //   required(p.expYear);
    //   required(p.cvv);
    //   minLength(p.cvv, 3);
    //   maxLength(p.cvv, 4);
    // });
    // apply(f.payment, paymentSchema);
  });

  // TODO 6: Implement submit
  async onSubmit() {
    this.successMessage.set(null);

    // await submit(this.bookingForm, async (formTree) => {
    //   await new Promise(resolve => setTimeout(resolve, 2000));
    //   this.successMessage.set(
    //     `Flight booked! ${formTree().value().passenger.firstName} ${formTree().value().passenger.lastName} — ${formTree().value().flight.from} → ${formTree().value().flight.to}`
    //   );
    //   return null;
    // });
  }
}
