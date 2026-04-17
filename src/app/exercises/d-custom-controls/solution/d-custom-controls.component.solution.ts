import { Component, signal, model } from '@angular/core';
import { form, FormField, required, min, FormValueControl } from '@angular/forms/signals';

// ── StarRatingComponent ────────────────────────────────────────────────────

@Component({
  selector: 'app-star-rating-solution',
  standalone: true,
  template: `
    <div class="star-rating">
      @for (star of stars; track star) {
        <button
          type="button"
          class="star-btn"
          [class.filled]="star <= (hoveredStar() || value())"
          [class.hovered]="star <= hoveredStar()"
          (click)="selectStar(star)"
          (mouseenter)="hoveredStar.set(star)"
          (mouseleave)="hoveredStar.set(0)"
          [attr.aria-label]="'Rate ' + star + ' out of 5'">
          {{ star <= (hoveredStar() || value()) ? '★' : '☆' }}
        </button>
      }
      @if (value() > 0) {
        <span class="rating-label">{{ labels[value() - 1] }}</span>
      }
    </div>
  `,
  styles: [`
    .star-rating { display: flex; align-items: center; gap: 0.25rem; }
    .star-btn {
      background: none; border: none; font-size: 1.75rem; cursor: pointer;
      padding: 0.25rem; color: #dee2e6; transition: transform 0.1s ease, color 0.2s ease;
      &:hover { transform: scale(1.2); }
      &.filled  { color: #fcc419; }
      &.hovered { color: #fab005; }
    }
    .rating-label { margin-left: 0.75rem; font-size: 0.9rem; color: #495057; font-weight: 500; }
  `]
})
export class StarRatingSolutionComponent implements FormValueControl<number> {
  value = model<number>(0);

  readonly hoveredStar = signal(0);
  readonly stars = [1, 2, 3, 4, 5];
  readonly labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  selectStar(star: number): void {
    this.value.set(star);
  }
}

// ── PriorityPickerComponent ────────────────────────────────────────────────

@Component({
  selector: 'app-priority-picker-solution',
  standalone: true,
  template: `
    <div class="priority-picker">
      @for (opt of options; track opt.value) {
        <button
          type="button"
          class="priority-btn"
          [class]="'priority-btn level-' + opt.value"
          [class.selected]="value() === opt.value"
          (click)="select(opt.value)">
          {{ opt.icon }} {{ opt.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    .priority-picker { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .priority-btn {
      padding: 0.4rem 0.9rem; border: 2px solid #e4e7eb; border-radius: 20px;
      background: white; font-size: 0.85rem; font-weight: 500; cursor: pointer;
      transition: all 0.15s; color: #6c757d; &:hover { opacity: 0.85; }
    }
    .level-low.selected    { background: #d3f9d8; border-color: #51cf66; color: #2b8a3e; }
    .level-medium.selected { background: #fff9db; border-color: #fcc419; color: #e67700; }
    .level-high.selected   { background: #ffe3e3; border-color: #f03e3e; color: #c92a2a; }
  `]
})
export class PriorityPickerSolutionComponent implements FormValueControl<string> {
  value = model<string>('low');

  readonly options = [
    { value: 'low',    label: 'Low',    icon: '🟢' },
    { value: 'medium', label: 'Medium', icon: '🟡' },
    { value: 'high',   label: 'High',   icon: '🔴' },
  ];

  select(val: string): void {
    this.value.set(val);
  }
}

// ── Main component ─────────────────────────────────────────────────────────

@Component({
  selector: 'app-d-custom-controls-solution',
  standalone: true,
  imports: [FormField, StarRatingSolutionComponent, PriorityPickerSolutionComponent],
  templateUrl: './d-custom-controls.component.solution.html',
  styleUrl: '../d-custom-controls.component.css'
})
export class DCustomControlsSolutionComponent {

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
