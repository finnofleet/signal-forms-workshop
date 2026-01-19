import { Component, signal, computed, input, model } from '@angular/core';
import { form, FormField, required, min, max, validate } from '@angular/forms/signals';
import { FormValueControl } from '@angular/forms/signals';

// ============================================
// Custom Star Rating Component
// ============================================
@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <div class="star-rating" [class.disabled]="disabled()">
      @for (star of stars; track star) {
        <button
          type="button"
          class="star-btn"
          [class.filled]="star <= (hoveredStar() || value())"
          [class.hovered]="star <= hoveredStar()"
          [disabled]="disabled()"
          (click)="selectStar(star)"
          (mouseenter)="hoveredStar.set(star)"
          (mouseleave)="hoveredStar.set(0)"
          [attr.aria-label]="'Rate ' + star + ' out of 5'">
          {{ star <= (hoveredStar() || value()) ? '★' : '☆' }}
        </button>
      }
      @if (value() > 0) {
        <span class="rating-text">{{ ratingLabels[value() - 1] }}</span>
      }
    </div>
  `,
  styles: [`
    .star-rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;

      &.disabled {
        opacity: 0.5;
        pointer-events: none;
      }
    }

    .star-btn {
      background: none;
      border: none;
      font-size: 1.75rem;
      cursor: pointer;
      padding: 0.25rem;
      transition: transform 0.1s ease, color 0.2s ease;
      color: #dee2e6;

      &:hover {
        transform: scale(1.2);
      }

      &.filled {
        color: #fcc419;
      }

      &.hovered {
        color: #fab005;
      }
    }

    .rating-text {
      margin-left: 0.75rem;
      font-size: 0.9rem;
      color: #495057;
      font-weight: 500;
    }
  `]
})
export class StarRatingComponent implements FormValueControl<number> {
  // FormValueControl implementation
  value = model<number>(0);
  disabled = input<boolean>(false);

  // Internal state
  hoveredStar = signal(0);
  stars = [1, 2, 3, 4, 5];
  ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  selectStar(star: number) {
    if (!this.disabled()) {
      this.value.set(star);
    }
  }
}

// ============================================
// Custom Quantity Selector Component
// ============================================
@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  template: `
    <div class="quantity-selector" [class.disabled]="disabled()">
      <button
        type="button"
        class="qty-btn minus"
        [disabled]="disabled() || value() <= minValue()"
        (click)="decrement()">
        −
      </button>
      <span class="qty-value">{{ value() }}</span>
      <button
        type="button"
        class="qty-btn plus"
        [disabled]="disabled() || value() >= maxValue()"
        (click)="increment()">
        +
      </button>
    </div>
  `,
  styles: [`
    .quantity-selector {
      display: inline-flex;
      align-items: center;
      border: 2px solid #e4e7eb;
      border-radius: 8px;
      overflow: hidden;

      &.disabled {
        opacity: 0.5;
      }
    }

    .qty-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: #f8f9fa;
      font-size: 1.25rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover:not(:disabled) {
        background: #e9ecef;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      &.minus { border-right: 1px solid #e4e7eb; }
      &.plus { border-left: 1px solid #e4e7eb; }
    }

    .qty-value {
      min-width: 50px;
      text-align: center;
      font-size: 1.1rem;
      font-weight: 600;
      padding: 0 0.5rem;
    }
  `]
})
export class QuantitySelectorComponent implements FormValueControl<number> {
  // FormValueControl implementation
  value = model<number>(1);
  disabled = input<boolean>(false);

  // Configuration
  minValue = input<number>(1);
  maxValue = input<number>(99);

  increment() {
    if (this.value() < this.maxValue()) {
      this.value.update(v => v + 1);
    }
  }

  decrement() {
    if (this.value() > this.minValue()) {
      this.value.update(v => v - 1);
    }
  }
}

// ============================================
// Main Exercise Component
// ============================================
@Component({
  selector: 'app-custom-controls',
  standalone: true,
  imports: [FormField, StarRatingComponent, QuantitySelectorComponent],
  template: `
    <div class="exercise-container">
      <header class="exercise-header">
        <h1>04 - Custom Form Controls</h1>
        <p class="subtitle">FormValueControl interface - goodbye ControlValueAccessor!</p>
      </header>

      <div class="alert alert-info">
        <strong>🎯 Learning Goals:</strong>
        <ul>
          <li>Understand <code>FormValueControl&lt;T&gt;</code> interface</li>
          <li>Create custom controls with <code>model()</code></li>
          <li>Integrate custom controls with <code>[formField]</code></li>
          <li>No more ControlValueAccessor boilerplate!</li>
        </ul>
      </div>

      <section class="exercise-section">
        <h3>⭐ Product Review Form</h3>

        <form (submit)="onSubmit()">
          <div class="form-group">
            <label for="productName">Product</label>
            <input
              id="productName"
              type="text"
              class="form-control"
              [formField]="reviewForm.productName"
              placeholder="Product name"
            />
          </div>

          <div class="form-group">
            <label>Your Rating</label>
            <app-star-rating [formField]="reviewForm.rating" />
            @if (reviewForm.rating().touched() && reviewForm.rating().invalid()) {
              @for (err of reviewForm.rating().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Please select a rating }
                    @case ('min') { Please select at least 1 star }
                  }
                </div>
              }
            }
          </div>

          <div class="form-group">
            <label>Quantity Purchased</label>
            <app-quantity-selector
              [formField]="reviewForm.quantity"
              [minValue]="1"
              [maxValue]="10"
            />
          </div>

          <div class="form-group">
            <label for="review">Your Review</label>
            <textarea
              id="review"
              class="form-control"
              [class.error]="reviewForm.reviewText().touched() && reviewForm.reviewText().invalid()"
              [formField]="reviewForm.reviewText"
              placeholder="Write your review..."
              rows="4">
            </textarea>
            @if (reviewForm.reviewText().touched() && reviewForm.reviewText().invalid()) {
              <div class="field-error">Review must be at least 10 characters</div>
            }
            <div class="field-hint">{{ reviewForm.reviewText().value().length }} / 500 characters</div>
          </div>

          <div class="form-group">
            <label class="checkbox-wrapper">
              <input
                type="checkbox"
                [checked]="reviewForm.recommend().value()"
                (change)="toggleRecommend()"
              />
              <span>I would recommend this product</span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="reviewForm().invalid()">
            Submit Review
          </button>
        </form>
      </section>

      <section class="exercise-section">
        <h3>📊 Review Preview</h3>
        <div class="review-preview">
          <div class="preview-rating">
            @for (star of [1,2,3,4,5]; track star) {
              <span class="preview-star" [class.filled]="star <= reviewForm.rating().value()">
                {{ star <= reviewForm.rating().value() ? '★' : '☆' }}
              </span>
            }
          </div>
          <p class="preview-product">{{ reviewForm.productName().value() || 'Product Name' }}</p>
          <p class="preview-text">{{ reviewForm.reviewText().value() || 'Your review will appear here...' }}</p>
          <p class="preview-meta">
            Quantity: {{ reviewForm.quantity().value() }} |
            Recommends: {{ reviewForm.recommend().value() ? 'Yes ✅' : 'No' }}
          </p>
        </div>
      </section>

      <section class="exercise-section">
        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>FormValueControl Interface (click to expand)</span>
          </summary>
          <div class="hint-content">
            <div class="code-block">
<pre>// The interface is simple:
interface FormValueControl&lt;T&gt; {{ '{' }}
  value: ModelSignal&lt;T&gt;;      // REQUIRED
  disabled?: InputSignal&lt;boolean&gt;;  // optional
  // ... other optional inputs
{{ '}' }}

// Implementation:
@Component({{ '{' }} ... {{ '}' }})
export class StarRating implements FormValueControl&lt;number&gt; {{ '{' }}
  value = model&lt;number&gt;(0);     // That's it!
  disabled = input(false);       // Optional
{{ '}' }}

// Usage with [formField]:
&lt;app-star-rating [formField]="form.rating" /&gt;</pre>
            </div>
          </div>
        </details>
      </section>

      <section class="exercise-section">
        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>Comparison: CVA vs FormValueControl (click to expand)</span>
          </summary>
          <div class="hint-content">
            <div class="code-block">
<pre>// ❌ OLD WAY: ControlValueAccessor (50+ lines)
@Component({{ '{' }}
  providers: [{{ '{' }}
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MyControl),
    multi: true
  {{ '}' }}]
{{ '}' }})
export class MyControl implements ControlValueAccessor {{ '{' }}
  private onChange = () => {{ '{' }}{{ '}' }};
  private onTouched = () => {{ '{' }}{{ '}' }};
  writeValue(v) {{ '{' }} ... {{ '}' }}
  registerOnChange(fn) {{ '{' }} this.onChange = fn; {{ '}' }}
  registerOnTouched(fn) {{ '{' }} this.onTouched = fn; {{ '}' }}
  setDisabledState(d) {{ '{' }} ... {{ '}' }}
{{ '}' }}

// ✅ NEW WAY: FormValueControl (3 lines!)
export class MyControl implements FormValueControl&lt;T&gt; {{ '{' }}
  value = model&lt;T&gt;(initialValue);
{{ '}' }}</pre>
            </div>
          </div>
        </details>
      </section>
    </div>
  `,
  styles: [`
    .review-preview {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .preview-rating {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .preview-star {
      color: #dee2e6;
      &.filled { color: #fcc419; }
    }

    .preview-product {
      font-weight: 600;
      font-size: 1.1rem;
      margin: 0.5rem 0;
    }

    .preview-text {
      color: #495057;
      font-style: italic;
      margin: 0.5rem 0;
    }

    .preview-meta {
      font-size: 0.85rem;
      color: #6c757d;
      margin: 0.5rem 0 0 0;
    }
  `]
})
export class CustomControlsComponent {
  // Form Model
  protected readonly reviewModel = signal({
    productName: '',
    rating: 0,
    quantity: 1,
    reviewText: '',
    recommend: false
  });

  // Form with validation
  protected readonly reviewForm = form(this.reviewModel, (f) => {
    required(f.productName);
    required(f.rating);
    min(f.rating, 1);
    min(f.quantity, 1);
    max(f.quantity, 10);
    validate(f.reviewText, ({ value }) => {
      const text = value();
      if (text && text.length < 10) {
        return { kind: 'minLength', message: 'Review must be at least 10 characters' };
      }
      if (text && text.length > 500) {
        return { kind: 'maxLength', message: 'Review must be less than 500 characters' };
      }
      return undefined;
    });
  });

  toggleRecommend() {
    this.reviewModel.update(m => ({ ...m, recommend: !m.recommend }));
  }

  onSubmit() {
    console.log('Review submitted:', this.reviewModel());
    alert('Review submitted! Check console for data.');
  }
}
