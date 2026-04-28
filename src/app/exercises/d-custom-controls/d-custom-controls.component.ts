/*
 * ================================================================
 * D – Custom Controls
 * ================================================================
 * Learning goals:
 *  - Understand the FormValueControl<T> interface
 *  - Replace a plain signal with model() to satisfy the interface
 *  - Wire custom controls to [formField] — no ControlValueAccessor boilerplate
 *
 * The UI components (StarRating, PriorityPicker) are ALREADY BUILT and working.
 * Your job: make them Signal-Forms compatible by implementing FormValueControl<T>.
 *
 * ✅ DONE WHEN:
 *  - StarRating binds with [formField] and shows validation errors
 *  - PriorityPicker binds with [formField]
 *  - Submit logs correct values for all fields
 *
 * 💡 Hint: check the collapsible "FormValueControl interface" section.
 * ================================================================
 */

import { Component, signal, input, model, InputSignal, InputSignalWithTransform, ModelSignal, OutputRef} from '@angular/core';
import {
  form,
  FormField,
  required,
  min,
  FormValueControl,
  DisabledReason,
  ValidationError,
  WithOptionalFieldTree
} from '@angular/forms/signals';

// ──────────────────────────────────────────────────────────────────────────────
// StarRatingComponent — the UI is ready and works standalone.
// TODO 1: Make it implement FormValueControl<number> so [formField] can bind to it.
// ──────────────────────────────────────────────────────────────────────────────
//
// Steps:
//  a) Add  implements FormValueControl<number>  to the class declaration.
//  b) Replace the plain signal  currentValue = signal(0)  with
//     value = model<number>(0)
//     (FormValueControl requires a property named `value` of type ModelSignal<T>)
//  c) Update the two places inside the class that reference `currentValue`
//     to use `value` instead.

@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <div class="star-rating">
      @for (star of stars; track star) {
        <button
          type="button"
          class="star-btn"
          [class.filled]="star <= (hoveredStar() || currentValue())"
          [class.hovered]="star <= hoveredStar()"
          (click)="selectStar(star)"
          (mouseenter)="hoveredStar.set(star)"
          (mouseleave)="hoveredStar.set(0)"
          [attr.aria-label]="'Rate ' + star + ' out of 5'">
          {{ star <= (hoveredStar() || currentValue()) ? '★' : '☆' }}
        </button>
      }
      @if (currentValue() > 0) {
        <span class="rating-label">{{ labels[currentValue() - 1] }}</span>
      }
    </div>
  `,
  styles: [`
    .star-rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .star-btn {
      background: none;
      border: none;
      font-size: 1.75rem;
      cursor: pointer;
      padding: 0.25rem;
      color: #dee2e6;
      transition: transform 0.1s ease, color 0.2s ease;
      &:hover { transform: scale(1.2); }
      &.filled  { color: #fcc419; }
      &.hovered { color: #fab005; }
    }

    .rating-label {
      margin-left: 0.75rem;
      font-size: 0.9rem;
      color: #495057;
      font-weight: 500;
    }
  `]
})
// TODO 1: implement FormValueControl<number> and adapt component
export class StarRatingComponent {
  protected readonly currentValue = signal(0);

  readonly hoveredStar = signal(0);
  readonly stars = [1, 2, 3, 4, 5];
  readonly labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  selectStar(star: number): void {
    this.currentValue.set(star);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// PriorityPickerComponent — same pattern, implement FormValueControl<string>.
// TODO 1: Make it implement FormValueControl<string> so [formField] can bind to it.
// ──────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-priority-picker',
  standalone: true,
  template: `
    <div class="priority-picker">
      @for (opt of options; track opt.value) {
        <button
          type="button"
          class="priority-btn"
          [class]="'priority-btn level-' + opt.value"
          [class.selected]="currentValue() === opt.value"
          (click)="select(opt.value)">
          {{ opt.icon }} {{ opt.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    .priority-picker { display: flex; gap: 0.5rem; flex-wrap: wrap; }

    .priority-btn {
      padding: 0.4rem 0.9rem;
      border: 2px solid #e4e7eb;
      border-radius: 20px;
      background: white;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      color: #6c757d;
      &:hover { opacity: 0.85; }
    }

    .level-low.selected    { background: #d3f9d8; border-color: #51cf66; color: #2b8a3e; }
    .level-medium.selected { background: #fff9db; border-color: #fcc419; color: #e67700; }
    .level-high.selected   { background: #ffe3e3; border-color: #f03e3e; color: #c92a2a; }
  `]
})
// TODO 2: implement FormValueControl<string> and adapt component
export class PriorityPickerComponent {
  protected readonly currentValue = signal('low');

  readonly options = [
    { value: 'low',    label: 'Low',    icon: '🟢' },
    { value: 'medium', label: 'Medium', icon: '🟡' },
    { value: 'high',   label: 'High',   icon: '🔴' },
  ];

  select(val: string): void {
    // TODO 2c: change currentValue to value
    this.currentValue.set(val);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Main exercise component — no TODOs here.
// Once StarRating and PriorityPicker implement FormValueControl, the [formField]
// bindings in the template will work automatically.
// ──────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-d-custom-controls',
  standalone: true,
  imports: [FormField, StarRatingComponent, PriorityPickerComponent],
  templateUrl: './d-custom-controls.component.html',
  styleUrl: './d-custom-controls.component.css'
})
export class DCustomControlsComponent {

  protected readonly feedbackModel = signal({
    title:    '',
    rating:   0,
    priority: 'low',
    comment:  '',
  });

  protected readonly feedbackForm = form(this.feedbackModel, (f) => {
    required(f.title);
    required(f.comment);
    min(f.rating, 1);
  });

  onSubmit(): void {
    console.log('Feedback submitted:', this.feedbackModel());
    alert('Feedback submitted! Check the console.');
  }
}
