import { Component, signal } from '@angular/core';
import { form, FormField, required, min, applyEach } from '@angular/forms/signals';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-array-basics',
  standalone: true,
  imports: [FormField, CurrencyPipe],
  template: `
    <div class="exercise-container">
      <header class="exercise-header">
        <h1>02 - Dynamic Arrays</h1>
        <p class="subtitle">Learn applyEach() and array manipulation</p>
      </header>

      <div class="alert alert-info">
        <strong>🎯 Learning Goals:</strong>
        <ul style="margin: 0.5rem 0 0 1.5rem; padding: 0;">
          <li>Work with arrays in Signal Forms</li>
          <li>Validate each item with <code>applyEach()</code></li>
          <li>Add/remove items with immutable updates</li>
        </ul>
      </div>

      <section class="exercise-section">
        <h3>🛒 Order Form</h3>

        <form (submit)="onSubmit()">
          <div class="form-group">
            <label for="customerName">Customer Name</label>
            <input
              id="customerName"
              type="text"
              class="form-control"
              [class.error]="orderForm.customerName().touched() && orderForm.customerName().invalid()"
              [formField]="orderForm.customerName"
              placeholder="Enter customer name"
            />
            @if (orderForm.customerName().touched() && orderForm.customerName().invalid()) {
              <div class="field-error">Customer name is required</div>
            }
          </div>

          <h4 style="margin-top: 1.5rem;">Order Items</h4>

          @for (item of orderForm.items; track item.id().value(); let i = $index) {
            <div class="item-row">
              <div class="item-fields">
                <div class="form-group">
                  <label>Product</label>
                  <input
                    type="text"
                    class="form-control"
                    [class.error]="item.product().touched() && item.product().invalid()"
                    [formField]="item.product"
                    placeholder="Product name"
                  />
                  @if (item.product().touched() && item.product().invalid()) {
                    <div class="field-error">Product is required</div>
                  }
                </div>

                <div class="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    class="form-control"
                    [class.error]="item.quantity().touched() && item.quantity().invalid()"
                    [formField]="item.quantity"
                  />
                  @if (item.quantity().touched() && item.quantity().invalid()) {
                    <div class="field-error">Min quantity is 1</div>
                  }
                </div>

                <div class="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    class="form-control"
                    [class.error]="item.price().touched() && item.price().invalid()"
                    [formField]="item.price"
                    step="0.01"
                  />
                  @if (item.price().touched() && item.price().invalid()) {
                    <div class="field-error">Price must be min 10</div>
                  }
                </div>
              </div>

              <button
                type="button"
                class="btn btn-danger btn-sm"
                (click)="removeItem(i)"
                [disabled]="orderForm.items.length === 1"
              >
                ✕
              </button>
            </div>
          }

          <button type="button" class="btn btn-secondary" (click)="addItem()">
            + Add Item
          </button>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="orderForm().invalid()">
              Submit Order
            </button>
          </div>
        </form>
      </section>

      <section class="exercise-section">
        <h3>📊 Order Summary</h3>
        <div class="summary">
          <p><strong>Items:</strong> {{ orderForm.items.length }}</p>
          <p><strong>Total:</strong> {{ calculateTotal() | currency }}</p>
        </div>
      </section>

      <section class="exercise-section">
        <h3>🔍 Form State (Debug)</h3>
        <div class="code-block">
          <pre>{{ formDebugInfo() }}</pre>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .item-row {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      padding: 1rem;
      margin-bottom: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e4e7eb;
    }

    .item-fields {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 1rem;
      flex: 1;
    }

    .item-row .form-group {
      margin-bottom: 0;
    }

    .btn-sm {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      margin-top: 1.5rem;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-danger:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 0.5rem;
    }

    .form-actions {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #e4e7eb;
    }

    .summary {
      background: #e8f4fd;
      padding: 1rem;
      border-radius: 8px;
    }

    .summary p {
      margin: 0.25rem 0;
    }
  `]
})
export class ArrayBasicsComponent {
  // 1. Form Model with array
  protected readonly orderModel = signal({
    customerName: '',
    items: [
      { id: crypto.randomUUID(), product: '', quantity: 1, price: 0 }
    ]
  });

  // 2. Form with validation schema
  protected readonly orderForm = form(this.orderModel, (f) => {
    required(f.customerName);

    // Validate EACH item in the array
    applyEach(f.items, (item) => {
      required(item.product);
      min(item.quantity, 1);
      min(item.price, 10);
    });
  });

  // Add new item - immutable update
  addItem() {
    this.orderModel.update(current => ({
      ...current,
      items: [
        ...current.items,
        { id: crypto.randomUUID(), product: '', quantity: 1, price: 0 }
      ]
    }));
  }

  // Remove item - immutable update
  removeItem(index: number) {
    this.orderModel.update(current => ({
      ...current,
      items: current.items.filter((_, i) => i !== index)
    }));
  }

  // Calculate total
  calculateTotal(): number {
    return this.orderModel().items.reduce(
      (sum, item) => sum + (item.quantity * item.price),
      0
    );
  }

  // Debug info
  protected formDebugInfo = () => {
    return JSON.stringify({
      value: this.orderForm().value(),
      valid: this.orderForm().valid(),
      itemsCount: this.orderForm.items.length,
      items: this.orderModel().items.map((_, i) => ({
        product: this.orderForm.items[i].product().value(),
        productValid: this.orderForm.items[i].product().valid(),
        quantity: this.orderForm.items[i].quantity().value(),
        price: this.orderForm.items[i].price().value()
      }))
    }, null, 2);
  };

  onSubmit() {
    console.log('Order submitted:', this.orderModel());
    alert('Order submitted! Check console for data.');
  }
}
