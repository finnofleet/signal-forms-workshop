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
import {JsonPipe} from '@angular/common';

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
  selector: 'app-c-dynamic-forms-solution',
  standalone: true,
  imports: [FormField, JsonPipe],
  templateUrl: './c-dynamic-forms.component.solution.html',
  styleUrl: '../c-dynamic-forms.component.css'
})
export class CDynamicFormsSolutionComponent {

  protected readonly orderModel = signal({
    customerType: 'personal' as 'personal' | 'business',
    companyName: '',
    taxId: '',
    contact: {
      email: '',
      phone: '',
    },
    deliveryType: 'pickup' as 'pickup' | 'delivery',
    address: {
      street: '',
      city: '',
      zip: '',
    },
    hasSpecialInstructions: false,
    notes: '',
  });

  protected readonly orderForm = form(this.orderModel, (f) => {
    apply(f.contact, contactSchema);

    // Part A: applyWhen — apply company validators only when customerType === 'business'
    applyWhen(
      f,
      ({valueOf}) => valueOf(f.customerType) === 'business',
      (f) => {
        required(f.companyName);
        required(f.taxId);
        pattern(f.taxId, /^[A-Z]{2}\d{9}$/);
      },
    );

    // Part B: hidden + address validators
    hidden(f.address.street, ({valueOf}) => valueOf(f.deliveryType) !== 'delivery');
    hidden(f.address.city, ({valueOf}) => valueOf(f.deliveryType) !== 'delivery');
    hidden(f.address.zip, ({valueOf}) => valueOf(f.deliveryType) !== 'delivery');
    apply(f.address, addressSchema);

    // Part C: disabled — notes visible but inactive until opt-in
    disabled(f.notes, ({valueOf}) => !valueOf(f.hasSpecialInstructions));
    required(f.notes);
    minLength(f.notes, 10);
  });

  setCustomerType(type: 'personal' | 'business'): void {
    this.orderModel.update(m => ({...m, customerType: type}));
  }

  setDeliveryType(type: 'pickup' | 'delivery'): void {
    this.orderModel.update(m => ({...m, deliveryType: type}));
  }

  toggleSpecialInstructions(): void {
    this.orderModel.update(m => ({...m, hasSpecialInstructions: !m.hasSpecialInstructions}));
  }

  onSubmit(event: SubmitEvent): void {
    // prevent default form behavior causing site refresh and preventing further processing from this method
    event.preventDefault();

    console.log('Order submitted:', this.orderModel());
    alert(`Order placed! Check the console.${this.orderForm.notes().disabled() && !!this.orderForm.notes().value()
      ? '\nAlthough the form field is disabled, the special instructions are still submitted...'
      : ''}`);
  }
}
