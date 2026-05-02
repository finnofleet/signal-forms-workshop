/*
 * ================================================================
 * C – Dynamic Forms
 * ================================================================
 * Learning goals:
 *  - Show/hide form sections reactively with @if
 *  - Conditionally apply validators with applyWhen()
 *  - Exclude fields from validation with hidden()
 *  - Disable fields conditionally with disabled()
 *  - Understand the difference: hidden = invisible, disabled = visible but read-only
 *
 * ✅ PART A – Done when business validators only fire for business orders  (15 min)
 * ✅ PART B – Done when address fields hide and unhide via hidden()         (15 min)
 * ✅ PART C – Done when the notes field enables/disables via disabled()     (10 min)
 *
 * Key insight:
 *   @if          → controls VISIBILITY only, validation is unaffected
 *   applyWhen()  → validators only active under a condition
 *   hidden()     → field invisible + excluded from validation
 *   disabled()   → field visible but read-only + excluded from validation
 *
 * 💡 Hints at the bottom of the page.
 * ================================================================
 */

import {Component, signal} from '@angular/core';
import {
  apply,
  applyWhen,
  disabled,
  email,
  form,
  FormField,
  hidden,
  minLength,
  pattern,
  required,
  schema,
} from '@angular/forms/signals';

// Reusable schemas — used with apply() inside the form schema function.
// No need to touch these.

const contactSchema = schema<{ email: string; phone: string }>((c) => {
  required(c.email);
  email(c.email);
  required(c.phone);
  pattern(c.phone, /^\+?[0-9\s\-()]{7,}$/);
});

const addressSchema = schema<{ street: string; city: string; zip: string }>((a) => {
  required(a.street);
  required(a.city);
  required(a.zip);
  pattern(a.zip, /^\d{4,6}$/);
});

@Component({
  selector: 'app-c-dynamic-forms',
  standalone: true,
  imports: [FormField],
  templateUrl: './c-dynamic-forms.component.html',
  styleUrl: './c-dynamic-forms.component.css'
})
export class CDynamicFormsComponent {

  protected readonly orderModel = signal({
    customerType: 'personal' as 'personal' | 'business',
    companyName:  '',
    taxId:        '',
    contact: {
      email: '',
      phone: '',
    },
    deliveryType: 'pickup' as 'pickup' | 'delivery',
    address: {
      street: '',
      city:   '',
      zip:    '',
    },
    // Part C ↓
    hasSpecialInstructions: false,
    notes: '',
  });

  protected readonly orderForm = form(this.orderModel, (f) => {

    // Contact info is always required — no condition needed.
    apply(f.contact, contactSchema);

    // ── Part A: applyWhen ──────────────────────────────────────────────────
    //
    // PROBLEM: The company section is hidden with @if in the template,
    // but the companyName and taxId validators still run — making the form
    // permanently invalid for personal orders.
    //
    // SOLUTION: applyWhen() — only applies the inner validators when the
    // condition function returns true.
    //
    // TODO A-1: Wrap the company validators in applyWhen so they only fire
    //           when customerType === 'business'.
    //  Hints:
    //      use applyWhen on the entire form
    //      companyName is required
    //      taxId is required and should match pattern /^[A-Z]{2}\d{9}$/

    // ── Part B: hidden() ──────────────────────────────────────────────────
    //
    // PROBLEM: The address section uses @if based on the model value in the
    // template. But the address validators (from addressSchema below) still
    // run when the section is hidden — blocking submission.
    //
    // SOLUTION: hidden() — marks each field as hidden when the condition is
    // true. Hidden fields are excluded from form validation automatically.
    // In the template, switch from a model-based @if to field().hidden().
    //
    // Check the HTML template for additional related TODOs.
    //
    // TODO B-1: Mark all 3 address fields as hidden when deliveryType !== 'delivery'.
    //  Hints:
    //      ({ valueOf }) => valueOf(f.deliveryType) !== 'delivery')
    //
    // TODO B-2: After adding hidden(), also add address validation so the
    //           fields are required when they ARE shown:
    //  Hints:
    //      apply addressSchema

    // ── Part C: disabled() ────────────────────────────────────────────────
    //
    // Unlike hidden(), disabled fields remain VISIBLE in the template.
    // They are rendered as greyed-out / read-only, and their validators
    // are also skipped — so they don't block form submission.
    //
    // The notes textarea should be disabled when hasSpecialInstructions is false,
    // and required (with a minimum length) when it is enabled.
    //
    // Check the HTML template for additional related TODOs.
    //
    // TODO C-1: Disable the notes field when hasSpecialInstructions is false.
    //
    // TODO C-2: Make notes required and at least 10 chars when enabled.
    //           Because disabled() skips validators when inactive, you can add
    //           these unconditionally — they only fire when the field is enabled.
  });

  // KEEP AS-IS — mutate the model to toggle enums / booleans
  setCustomerType(type: 'personal' | 'business'): void {
    this.orderModel.update(m => ({ ...m, customerType: type }));
  }

  setDeliveryType(type: 'pickup' | 'delivery'): void {
    this.orderModel.update(m => ({ ...m, deliveryType: type }));
  }

  toggleSpecialInstructions(): void {
    this.orderModel.update(m => ({ ...m, hasSpecialInstructions: !m.hasSpecialInstructions }));
  }

  onSubmit(event: SubmitEvent): void {
    // prevent default form behavior causing site refresh and preventing further processing from this method
    event.preventDefault();

    console.log('Order submitted:', this.orderModel());
    alert('Order placed! Check the console.');
  }
}
