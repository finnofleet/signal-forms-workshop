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
// Child Components
// ============================================

@Component({
  selector: 'app-passenger-form',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="subform-card">
      <h4>👤 Passenger Details</h4>
      <div class="form-row">
        <div class="form-group">
          <label>First Name</label>
          <input
            type="text"
            class="form-control"
            [class.error]="passenger().firstName().touched() && passenger().firstName().invalid()"
            [formField]="passenger().firstName"
            placeholder="First name"
          />
          @if (passenger().firstName().touched() && passenger().firstName().invalid()) {
            @for (err of passenger().firstName().errors(); track err.kind) {
              <div class="field-error">
                @switch (err.kind) {
                  @case ('required') { First name is required }
                  @default { {{ err.message || 'Invalid' }} }
                }
              </div>
            }
          }
        </div>

        <div class="form-group">
          <label>Last Name</label>
          <input
            type="text"
            class="form-control"
            [class.error]="passenger().lastName().touched() && passenger().lastName().invalid()"
            [formField]="passenger().lastName"
            placeholder="Last name"
          />
          @if (passenger().lastName().touched() && passenger().lastName().invalid()) {
            @for (err of passenger().lastName().errors(); track err.kind) {
              <div class="field-error">
                @switch (err.kind) {
                  @case ('required') { Last name is required }
                  @default { {{ err.message || 'Invalid' }} }
                }
              </div>
            }
          }
        </div>
      </div>

      <div class="form-group">
        <label>Email</label>
        <input
          type="email"
          class="form-control"
          [class.error]="passenger().email().touched() && passenger().email().invalid()"
          [formField]="passenger().email"
          placeholder="passenger@email.com"
        />
        @if (passenger().email().touched() && passenger().email().invalid()) {
          @for (err of passenger().email().errors(); track err.kind) {
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
        <label>Phone</label>
        <input
          type="tel"
          class="form-control"
          [formField]="passenger().phone"
          placeholder="+1 234 567 890"
        />
      </div>
    </div>
  `,
  styles: [`
    .subform-card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      h4 { margin: 0 0 1rem; font-size: 1.1rem; }
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  `]
})
export class PassengerFormComponent {
  readonly passenger = input.required<FieldTree<BookingFormModel['passenger']>>();
}

@Component({
  selector: 'app-flight-form',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="subform-card">
      <h4>✈️ Flight Details</h4>
      <div class="form-row">
        <div class="form-group">
          <label>From</label>
          <input
            type="text"
            class="form-control"
            [class.error]="flight().from().touched() && flight().from().invalid()"
            [formField]="flight().from"
            placeholder="Departure city"
          />
          @if (flight().from().touched() && flight().from().invalid()) {
            <div class="field-error">Departure city is required</div>
          }
        </div>

        <div class="form-group">
          <label>To</label>
          <input
            type="text"
            class="form-control"
            [class.error]="flight().to().touched() && flight().to().invalid()"
            [formField]="flight().to"
            placeholder="Arrival city"
          />
          @if (flight().to().touched() && flight().to().invalid()) {
            <div class="field-error">Arrival city is required</div>
          }
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Date</label>
          <input
            type="date"
            class="form-control"
            [class.error]="flight().date().touched() && flight().date().invalid()"
            [formField]="flight().date"
          />
          @if (flight().date().touched() && flight().date().invalid()) {
            <div class="field-error">Flight date is required</div>
          }
        </div>

        <div class="form-group">
          <label>Class</label>
          <select class="form-control" [formField]="flight().class">
            <option value="economy">Economy</option>
            <option value="business">Business</option>
          </select>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .subform-card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      h4 { margin: 0 0 1rem; font-size: 1.1rem; }
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  `]
})
export class FlightFormComponent {
  readonly flight = input.required<FieldTree<BookingFormModel['flight']>>();
}

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="subform-card">
      <h4>💳 Payment Details</h4>
      <div class="form-group">
        <label>Card Number</label>
        <input
          type="text"
          class="form-control"
          [class.error]="payment().cardNumber().touched() && payment().cardNumber().invalid()"
          [formField]="payment().cardNumber"
          placeholder="1234 5678 9012 3456"
        />
        @if (payment().cardNumber().touched() && payment().cardNumber().invalid()) {
          @for (err of payment().cardNumber().errors(); track err.kind) {
            <div class="field-error">
              @switch (err.kind) {
                @case ('required') { Card number is required }
                @case ('minLength') { Card number must be 16 digits }
                @case ('maxLength') { Card number must be 16 digits }
                @default { {{ err.message || 'Invalid' }} }
              }
            </div>
          }
        }
      </div>

      <div class="form-row-3">
        <div class="form-group">
          <label>Month</label>
          <input
            type="text"
            class="form-control"
            [class.error]="payment().expMonth().touched() && payment().expMonth().invalid()"
            [formField]="payment().expMonth"
            placeholder="MM"
          />
          @if (payment().expMonth().touched() && payment().expMonth().invalid()) {
            <div class="field-error">Required</div>
          }
        </div>

        <div class="form-group">
          <label>Year</label>
          <input
            type="text"
            class="form-control"
            [class.error]="payment().expYear().touched() && payment().expYear().invalid()"
            [formField]="payment().expYear"
            placeholder="YY"
          />
          @if (payment().expYear().touched() && payment().expYear().invalid()) {
            <div class="field-error">Required</div>
          }
        </div>

        <div class="form-group">
          <label>CVV</label>
          <input
            type="text"
            class="form-control"
            [class.error]="payment().cvv().touched() && payment().cvv().invalid()"
            [formField]="payment().cvv"
            placeholder="123"
          />
          @if (payment().cvv().touched() && payment().cvv().invalid()) {
            @for (err of payment().cvv().errors(); track err.kind) {
              <div class="field-error">
                @switch (err.kind) {
                  @case ('required') { CVV is required }
                  @case ('minLength') { CVV must be 3-4 digits }
                  @default { {{ err.message || 'Invalid' }} }
                }
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .subform-card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      h4 { margin: 0 0 1rem; font-size: 1.1rem; }
    }
    .form-row-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
    }
  `]
})
export class PaymentFormComponent {
  readonly payment = input.required<FieldTree<BookingFormModel['payment']>>();
}

// ============================================
// Parent Component
// ============================================

@Component({
  selector: 'app-subforms',
  standalone: true,
  imports: [PassengerFormComponent, FlightFormComponent, PaymentFormComponent, JsonPipe],
  templateUrl: './subforms.component.solution.html',
  styleUrl: './subforms.component.solution.scss'
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

  // Reusable schemas for each section
  private readonly passengerSchema = schema<BookingFormModel['passenger']>((f) => {
    required(f.firstName);
    required(f.lastName);
    required(f.email);
    email(f.email);
  });

  private readonly flightSchema = schema<BookingFormModel['flight']>((f) => {
    required(f.from);
    required(f.to);
    required(f.date);
  });

  private readonly paymentSchema = schema<BookingFormModel['payment']>((f) => {
    required(f.cardNumber);
    minLength(f.cardNumber, 16);
    maxLength(f.cardNumber, 16);
    required(f.expMonth);
    required(f.expYear);
    required(f.cvv);
    minLength(f.cvv, 3);
    maxLength(f.cvv, 4);
  });

  protected readonly bookingForm = form(this.bookingModel, (f) => {
    apply(f.passenger, this.passengerSchema);
    apply(f.flight, this.flightSchema);
    apply(f.payment, this.paymentSchema);
  });

  async onSubmit() {
    this.successMessage.set(null);

    await submit(this.bookingForm, async (formTree) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const val = formTree().value();
      this.successMessage.set(
        `Flight booked! ${val.passenger.firstName} ${val.passenger.lastName} — ${val.flight.from} → ${val.flight.to} (${val.flight.class})`
      );
      return null;
    });
  }
}
