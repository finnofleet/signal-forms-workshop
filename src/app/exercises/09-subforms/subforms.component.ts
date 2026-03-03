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
      <!-- TODO 1a: Add firstName, lastName, email, phone fields -->
      <!-- Each field should bind to the passenger FieldTree and show validation errors -->
      <!-- Hint: See the "FieldTree" hint section for binding syntax -->
      <p class="todo-placeholder">TODO: Implement passenger form fields</p>
    </div>
  `
})
export class PassengerFormComponent {
  // TODO 1b: Declare input with proper FieldTree type instead of any
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
  // TODO 2b: Declare input with proper FieldTree type instead of any
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
  // TODO 3b: Declare input with proper FieldTree type instead of any
  readonly payment = input.required<any>();
}

// ============================================
// Parent Component
// ============================================

@Component({
  selector: 'app-subforms',
  standalone: true,
  imports: [PassengerFormComponent, FlightFormComponent, PaymentFormComponent, JsonPipe],
  templateUrl: './subforms.component.html',
  styleUrl: './subforms.component.scss'
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

  // TODO 5: Create validation for each section
  // Passenger: firstName and lastName required, email required + valid format
  // Flight: from, to, and date are required
  // Payment: cardNumber required, expMonth/expYear required, cvv required
  protected readonly bookingForm = form(this.bookingModel, (f) => {
  });

  // TODO 6: Use submit() — simulate API call, show success message with passenger name and route
  async onSubmit() {
    this.successMessage.set(null);
  }
}
