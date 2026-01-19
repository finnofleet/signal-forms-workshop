import { Component, signal, computed } from '@angular/core';
import { form, FormField, required, email, minLength, pattern, schema, apply, applyWhen } from '@angular/forms/signals';

// Reusable Address Schema
const addressSchema = schema<{
  street: string;
  city: string;
  postalCode: string;
  country: string;
}>((addr) => {
  required(addr.street, { message: 'Street is required' });
  required(addr.city, { message: 'City is required' });
  required(addr.postalCode, { message: 'Postal code is required' });
  pattern(addr.postalCode, /^\d{2}-\d{3}$/, { message: 'Format: XX-XXX' });
  required(addr.country, { message: 'Country is required' });
});

// Reusable Contact Schema
const contactSchema = schema<{
  email: string;
  phone: string;
}>((contact) => {
  required(contact.email);
  email(contact.email);
  pattern(contact.phone, /^\d{9}$/, { message: 'Phone must be 9 digits' });
});

@Component({
  selector: 'app-schemas',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="exercise-container">
      <header class="exercise-header">
        <h1>03 - Schemas & Conditional Logic</h1>
        <p class="subtitle">Reusable validation schemas, applyWhen, disabled/hidden fields</p>
      </header>

      <div class="alert alert-info">
        <strong>🎯 Learning Goals:</strong>
        <ul>
          <li>Create reusable validation schemas with <code>schema()</code></li>
          <li>Apply schemas with <code>apply()</code></li>
          <li>Conditional validation with <code>applyWhen()</code></li>
          <li>DRY principle - define once, use everywhere</li>
        </ul>
      </div>

      <section class="exercise-section">
        <h3>📦 Order Form with Schemas</h3>

        <form (submit)="onSubmit()">
          <!-- Customer Type Selection -->
          <div class="form-group">
            <label>Customer Type</label>
            <div class="radio-group">
              <label class="radio-option">
                <input
                  type="radio"
                  name="customerType"
                  value="personal"
                  [checked]="orderForm.customerType().value() === 'personal'"
                  (change)="setCustomerType('personal')"
                />
                <span>👤 Personal</span>
              </label>
              <label class="radio-option">
                <input
                  type="radio"
                  name="customerType"
                  value="business"
                  [checked]="orderForm.customerType().value() === 'business'"
                  (change)="setCustomerType('business')"
                />
                <span>🏢 Business</span>
              </label>
            </div>
          </div>

          <!-- Business Fields (Conditional) -->
          @if (orderForm.customerType().value() === 'business') {
            <div class="conditional-section">
              <h4>🏢 Business Information</h4>
              <div class="form-group">
                <label for="companyName">Company Name</label>
                <input
                  id="companyName"
                  type="text"
                  class="form-control"
                  [class.error]="orderForm.companyName().touched() && orderForm.companyName().invalid()"
                  [formField]="orderForm.companyName"
                  placeholder="Your company name"
                />
                @if (orderForm.companyName().touched() && orderForm.companyName().invalid()) {
                  <div class="field-error">Company name is required for business customers</div>
                }
              </div>

              <div class="form-group">
                <label for="taxId">Tax ID (NIP)</label>
                <input
                  id="taxId"
                  type="text"
                  class="form-control"
                  [class.error]="orderForm.taxId().touched() && orderForm.taxId().invalid()"
                  [formField]="orderForm.taxId"
                  placeholder="XX-XXX-XX-XX"
                />
                @if (orderForm.taxId().touched() && orderForm.taxId().invalid()) {
                  <div class="field-error">Valid Tax ID is required</div>
                }
              </div>
            </div>
          }

          <!-- Contact Section (uses contactSchema) -->
          <div class="form-section">
            <h4>📧 Contact Information</h4>
            <div class="form-row">
              <div class="form-group">
                <label for="contactEmail">Email</label>
                <input
                  id="contactEmail"
                  type="email"
                  class="form-control"
                  [class.error]="orderForm.contact.email().touched() && orderForm.contact.email().invalid()"
                  [formField]="orderForm.contact.email"
                  placeholder="your@email.com"
                />
                @if (orderForm.contact.email().touched() && orderForm.contact.email().invalid()) {
                  @for (err of orderForm.contact.email().errors(); track err.kind) {
                    <div class="field-error">
                      @switch (err.kind) {
                        @case ('required') { Email is required }
                        @case ('email') { Invalid email format }
                      }
                    </div>
                  }
                }
              </div>
              <div class="form-group">
                <label for="contactPhone">Phone</label>
                <input
                  id="contactPhone"
                  type="tel"
                  class="form-control"
                  [class.error]="orderForm.contact.phone().touched() && orderForm.contact.phone().invalid()"
                  [formField]="orderForm.contact.phone"
                  placeholder="123456789"
                />
                @if (orderForm.contact.phone().touched() && orderForm.contact.phone().invalid()) {
                  <div class="field-error">Phone must be 9 digits</div>
                }
              </div>
            </div>
          </div>

          <!-- Delivery Type -->
          <div class="form-group">
            <label>Delivery Type</label>
            <div class="radio-group">
              <label class="radio-option">
                <input
                  type="radio"
                  name="deliveryType"
                  value="pickup"
                  [checked]="orderForm.deliveryType().value() === 'pickup'"
                  (change)="setDeliveryType('pickup')"
                />
                <span>🏪 Pickup (free)</span>
              </label>
              <label class="radio-option">
                <input
                  type="radio"
                  name="deliveryType"
                  value="shipping"
                  [checked]="orderForm.deliveryType().value() === 'shipping'"
                  (change)="setDeliveryType('shipping')"
                />
                <span>🚚 Shipping (+$10)</span>
              </label>
            </div>
          </div>

          <!-- Shipping Address (Conditional - uses addressSchema) -->
          @if (orderForm.deliveryType().value() === 'shipping') {
            <div class="conditional-section">
              <h4>📍 Shipping Address</h4>
              <div class="form-group">
                <label for="street">Street</label>
                <input
                  id="street"
                  type="text"
                  class="form-control"
                  [class.error]="orderForm.shippingAddress.street().touched() && orderForm.shippingAddress.street().invalid()"
                  [formField]="orderForm.shippingAddress.street"
                  placeholder="123 Main St"
                />
                @if (orderForm.shippingAddress.street().touched() && orderForm.shippingAddress.street().invalid()) {
                  <div class="field-error">Street is required</div>
                }
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="city">City</label>
                  <input
                    id="city"
                    type="text"
                    class="form-control"
                    [class.error]="orderForm.shippingAddress.city().touched() && orderForm.shippingAddress.city().invalid()"
                    [formField]="orderForm.shippingAddress.city"
                    placeholder="Warsaw"
                  />
                  @if (orderForm.shippingAddress.city().touched() && orderForm.shippingAddress.city().invalid()) {
                    <div class="field-error">City is required</div>
                  }
                </div>
                <div class="form-group">
                  <label for="postalCode">Postal Code</label>
                  <input
                    id="postalCode"
                    type="text"
                    class="form-control"
                    [class.error]="orderForm.shippingAddress.postalCode().touched() && orderForm.shippingAddress.postalCode().invalid()"
                    [formField]="orderForm.shippingAddress.postalCode"
                    placeholder="00-001"
                  />
                  @if (orderForm.shippingAddress.postalCode().touched() && orderForm.shippingAddress.postalCode().invalid()) {
                    <div class="field-error">Format: XX-XXX</div>
                  }
                </div>
              </div>

              <div class="form-group">
                <label for="country">Country</label>
                <select
                  id="country"
                  class="form-control"
                  [class.error]="orderForm.shippingAddress.country().touched() && orderForm.shippingAddress.country().invalid()"
                  [formField]="orderForm.shippingAddress.country">
                  <option value="">Select country</option>
                  <option value="PL">Poland</option>
                  <option value="DE">Germany</option>
                  <option value="UK">United Kingdom</option>
                </select>
                @if (orderForm.shippingAddress.country().touched() && orderForm.shippingAddress.country().invalid()) {
                  <div class="field-error">Country is required</div>
                }
              </div>
            </div>
          }

          <button type="submit" class="btn btn-primary" [disabled]="orderForm().invalid()">
            Place Order
          </button>
        </form>
      </section>

      <section class="exercise-section">
        <h3>📊 Form Summary</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Customer Type:</span>
            <span class="value">{{ orderForm.customerType().value() || '-' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Delivery:</span>
            <span class="value">{{ orderForm.deliveryType().value() || '-' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Form Valid:</span>
            <span class="value" [class.valid]="orderForm().valid()" [class.invalid]="orderForm().invalid()">
              {{ orderForm().valid() ? '✅ Yes' : '❌ No' }}
            </span>
          </div>
        </div>
      </section>

      <section class="exercise-section">
        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>Schema Definition (click to expand)</span>
          </summary>
          <div class="hint-content">
            <div class="code-block">
<pre>// Define reusable schema
const addressSchema = schema&lt;Address&gt;((addr) => {{ '{' }}
  required(addr.street);
  required(addr.city);
  required(addr.postalCode);
  pattern(addr.postalCode, /^\\d{{ '{' }}2{{ '}' }}-\\d{{ '{' }}3{{ '}' }}$/);
  required(addr.country);
{{ '}' }});

// Apply schema to form field
const orderForm = form(model, (f) => {{ '{' }}
  apply(f.shippingAddress, addressSchema);
{{ '}' }});</pre>
            </div>
          </div>
        </details>
      </section>

      <section class="exercise-section">
        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>Conditional Validation with applyWhen (click to expand)</span>
          </summary>
          <div class="hint-content">
            <div class="code-block">
<pre>// Apply validation only when condition is true
applyWhen(
  f,
  ({{ '{' }} valueOf {{ '}' }}) => valueOf(f.deliveryType) === 'shipping',
  (form) => {{ '{' }}
    apply(form.shippingAddress, addressSchema);
  {{ '}' }}
);

// Business fields only for business customers
applyWhen(
  f,
  ({{ '{' }} valueOf {{ '}' }}) => valueOf(f.customerType) === 'business',
  (form) => {{ '{' }}
    required(form.companyName);
    required(form.taxId);
    pattern(form.taxId, /^\\d{{ '{' }}2{{ '}' }}-\\d{{ '{' }}3{{ '}' }}-\\d{{ '{' }}2{{ '}' }}-\\d{{ '{' }}2{{ '}' }}$/);
  {{ '}' }}
);</pre>
            </div>
          </div>
        </details>
      </section>
    </div>
  `,
  styles: [`
    .radio-group {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: 2px solid #e4e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: #4ecdc4;
      }

      &:has(input:checked) {
        border-color: #4ecdc4;
        background: rgba(78, 205, 196, 0.1);
      }

      input {
        cursor: pointer;
      }
    }

    .conditional-section {
      background: #f8f9fa;
      border: 2px dashed #e4e7eb;
      border-radius: 8px;
      padding: 1.5rem;
      margin: 1.5rem 0;
      animation: fadeIn 0.3s ease;

      h4 {
        margin: 0 0 1rem 0;
        color: #495057;
      }
    }

    .form-section {
      margin: 1.5rem 0;

      h4 {
        margin: 0 0 1rem 0;
        color: #495057;
      }
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .label {
        font-size: 0.8rem;
        color: #6c757d;
        text-transform: uppercase;
      }

      .value {
        font-weight: 600;
        font-size: 1.1rem;

        &.valid { color: #51cf66; }
        &.invalid { color: #f03e3e; }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SchemasComponent {
  // Form Model
  protected readonly orderModel = signal({
    customerType: 'personal' as 'personal' | 'business',
    companyName: '',
    taxId: '',
    contact: {
      email: '',
      phone: ''
    },
    deliveryType: 'pickup' as 'pickup' | 'shipping',
    shippingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    }
  });

  // Form with schemas and conditional validation
  protected readonly orderForm = form(this.orderModel, (f) => {
    // Contact schema - always applied
    apply(f.contact, contactSchema);

    // Business fields - only when customerType is 'business'
    applyWhen(
      f,
      ({ valueOf }) => valueOf(f.customerType) === 'business',
      (form) => {
        required(form.companyName);
        required(form.taxId);
        pattern(form.taxId, /^\d{2}-\d{3}-\d{2}-\d{2}$/);
      }
    );

    // Shipping address - only when deliveryType is 'shipping'
    applyWhen(
      f,
      ({ valueOf }) => valueOf(f.deliveryType) === 'shipping',
      (form) => {
        apply(form.shippingAddress, addressSchema);
      }
    );
  });

  setCustomerType(type: 'personal' | 'business') {
    this.orderModel.update(m => ({ ...m, customerType: type }));
  }

  setDeliveryType(type: 'pickup' | 'shipping') {
    this.orderModel.update(m => ({ ...m, deliveryType: type }));
  }

  onSubmit() {
    console.log('Order submitted:', this.orderModel());
    alert('Order placed! Check console for data.');
  }
}
