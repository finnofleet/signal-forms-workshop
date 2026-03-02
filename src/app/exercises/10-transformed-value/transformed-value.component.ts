/*
 * ================================================================
 * 🎯 EXERCISE GOAL: transformedValue() — Parse/Format Controls
 * ================================================================
 * You will learn:
 * - Build custom controls with parse/format logic
 * - FormValueControl<T> with transformation layer
 * - How parse errors propagate to the parent form
 * - validate() to add parse error feedback
 *
 * ✅ DONE WHEN:
 * - DurationInput: "2h 30m" → model stores 150 (minutes)
 * - CurrencyInput: "1,500.00" → model stores 150000 (cents)
 * - Parse errors show when user types invalid input
 * - Event scheduler form works with both custom controls
 *
 * ⏱️ TIME: 10-12 minutes
 *
 * 💡 HINT: Use model() for the numeric value, and internal
 *   signal for display text. Parse on input, format on init.
 * ================================================================
 */

import { Component, signal, model, input, effect } from '@angular/core';
import { form, FormField, FormValueControl, required, min, validate } from '@angular/forms/signals';

// ============================================
// TODO 1: DurationInputComponent
// ============================================
// Parse: "2h 30m" → 150, "abc" → null (invalid)
// Format: 150 → "2h 30m"

// TODO 1a: Implement parseDuration and formatDuration helpers
// function parseDuration(text: string): number | null {
//   const hourMatch = text.match(/(\d+)\s*h/);
//   const minMatch = text.match(/(\d+)\s*m/);
//   if (!hourMatch && !minMatch) return null;
//   const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
//   const mins = minMatch ? parseInt(minMatch[1]) : 0;
//   return hours * 60 + mins;
// }
//
// function formatDuration(minutes: number): string {
//   if (minutes <= 0) return '';
//   const h = Math.floor(minutes / 60);
//   const m = minutes % 60;
//   if (h === 0) return `${m}m`;
//   if (m === 0) return `${h}h`;
//   return `${h}h ${m}m`;
// }

@Component({
  selector: 'app-duration-input',
  standalone: true,
  template: `
    <div class="custom-input">
      <input
        type="text"
        class="form-control"
        [value]="displayValue()"
        (input)="onInput($event)"
        placeholder="e.g. 2h 30m or 150m"
      />
      <span class="input-suffix">min</span>
    </div>
  `,
  styles: [`
    .custom-input { position: relative; }
    .input-suffix {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #868e96;
      font-size: 0.8rem;
    }
    input { padding-right: 40px; }
  `]
})
export class DurationInputComponent implements FormValueControl<number> {
  value = model<number>(0);
  disabled = input<boolean>(false);

  // Internal display state
  displayValue = signal('');
  parseError = signal<string | null>(null);

  // TODO 1b: Implement onInput — parse text to minutes, update value
  onInput(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.displayValue.set(text);
    // const minutes = parseDuration(text);
    // if (minutes !== null) {
    //   this.value.set(minutes);
    //   this.parseError.set(null);
    // } else {
    //   this.parseError.set('Invalid duration format');
    // }
  }
}

// ============================================
// TODO 2: CurrencyInputComponent
// ============================================
// Parse: "1,500.00" → 150000 (cents)
// Format: 150000 → "1,500.00"

// TODO 2a: Implement parseCurrency and formatCurrency helpers
// function parseCurrency(text: string): number | null { ... }
// function formatCurrency(cents: number): string { ... }

@Component({
  selector: 'app-currency-input',
  standalone: true,
  template: `
    <div class="custom-input">
      <span class="input-prefix">$</span>
      <input
        type="text"
        class="form-control with-prefix"
        [value]="displayValue()"
        (input)="onInput($event)"
        placeholder="e.g. 1,500.00"
      />
    </div>
  `,
  styles: [`
    .custom-input { position: relative; }
    .input-prefix {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #495057;
      font-weight: 600;
    }
    .with-prefix { padding-left: 28px; }
  `]
})
export class CurrencyInputComponent implements FormValueControl<number> {
  value = model<number>(0);
  disabled = input<boolean>(false);

  displayValue = signal('');
  parseError = signal<string | null>(null);

  // TODO 2b: Implement onInput — parse text to cents, update value
  onInput(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.displayValue.set(text);
    // const cents = parseCurrency(text);
    // if (cents !== null) {
    //   this.value.set(cents);
    //   this.parseError.set(null);
    // } else {
    //   this.parseError.set('Invalid amount');
    // }
  }
}

// ============================================
// Event Scheduler Form
// ============================================

interface EventFormModel {
  eventName: string;
  duration: number;     // stored as minutes
  ticketPrice: number;  // stored as cents
  maxAttendees: number;
}

@Component({
  selector: 'app-transformed-value',
  standalone: true,
  imports: [FormField, DurationInputComponent, CurrencyInputComponent],
  template: `
    <div class="exercise-container">
      <header class="exercise-header">
        <h1>10 - Parse/Format Custom Controls</h1>
        <p class="subtitle">Build controls that transform between display text and model values</p>
      </header>

      <div class="alert alert-info">
        <strong>🎯 Learning Goals:</strong>
        <ul>
          <li>Build <code>FormValueControl&lt;T&gt;</code> with parse/format logic</li>
          <li>Transform user input (text) ↔ model value (number)</li>
          <li>Handle parse errors and show feedback</li>
          <li>Use <code>validate()</code> to integrate parse errors</li>
        </ul>
      </div>

      <section class="exercise-section">
        <h3>📝 Event Scheduler</h3>

        <form (submit)="onSubmit()">
          <div class="form-group">
            <label for="eventName">Event Name</label>
            <input
              id="eventName"
              type="text"
              class="form-control"
              [class.error]="eventForm.eventName().touched() && eventForm.eventName().invalid()"
              [formField]="eventForm.eventName"
              placeholder="Angular Meetup"
            />
            @if (eventForm.eventName().touched() && eventForm.eventName().invalid()) {
              @for (err of eventForm.eventName().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Event name is required }
                    @default { {{ err.message || 'Invalid' }} }
                  }
                </div>
              }
            }
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Duration</label>
              <app-duration-input [formField]="eventForm.duration" />
              @if (eventForm.duration().touched() && eventForm.duration().invalid()) {
                @for (err of eventForm.duration().errors(); track err.kind) {
                  <div class="field-error">
                    @switch (err.kind) {
                      @case ('required') { Duration is required }
                      @case ('parse') { Invalid duration format. Use "2h 30m" or "150m" }
                      @case ('min') { Duration must be at least 15 minutes }
                      @default { {{ err.message || 'Invalid' }} }
                    }
                  </div>
                }
              }
              <small class="field-hint">Format: "2h 30m" or "150m"</small>
            </div>

            <div class="form-group">
              <label>Ticket Price</label>
              <app-currency-input [formField]="eventForm.ticketPrice" />
              @if (eventForm.ticketPrice().touched() && eventForm.ticketPrice().invalid()) {
                @for (err of eventForm.ticketPrice().errors(); track err.kind) {
                  <div class="field-error">
                    @switch (err.kind) {
                      @case ('required') { Ticket price is required }
                      @case ('parse') { Invalid amount. Use format "1,500.00" }
                      @case ('min') { Price must be at least $1.00 }
                      @default { {{ err.message || 'Invalid' }} }
                    }
                  </div>
                }
              }
              <small class="field-hint">Stored as cents (e.g. $15.00 = 1500)</small>
            </div>
          </div>

          <div class="form-group">
            <label for="maxAttendees">Max Attendees</label>
            <input
              id="maxAttendees"
              type="number"
              class="form-control"
              [formField]="eventForm.maxAttendees"
              placeholder="100"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="eventForm().invalid()">
            Create Event
          </button>
        </form>
      </section>

      @if (successMessage()) {
        <div class="alert alert-success">
          <strong>🎉 Success!</strong> {{ successMessage() }}
        </div>
      }

      <section class="exercise-section">
        <h3>🔍 Model Values (stored)</h3>
        <div class="debug-grid">
          <div class="debug-card">
            <span class="debug-label">Duration</span>
            <span class="debug-value">{{ eventForm.duration().value() }} minutes</span>
          </div>
          <div class="debug-card">
            <span class="debug-label">Ticket Price</span>
            <span class="debug-value">{{ eventForm.ticketPrice().value() }} cents</span>
          </div>
        </div>
        <div class="state-grid">
          <div class="state-item">
            <span class="label">Valid</span>
            <span class="value" [class.yes]="eventForm().valid()">{{ eventForm().valid() ? 'Yes' : 'No' }}</span>
          </div>
          <div class="state-item">
            <span class="label">Touched</span>
            <span class="value" [class.yes]="eventForm().touched()">{{ eventForm().touched() ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </section>

      <section class="exercise-section">
        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>Parse/Format pattern in FormValueControl (click to expand)</span>
          </summary>
          <div class="hint-content">
            <pre class="code-block">// Custom control with parse/format:
export class DurationInput implements FormValueControl&lt;number&gt; &#123;
  value = model&lt;number&gt;(0);        // numeric model value
  displayValue = signal('');       // text shown to user

  onInput(event: Event) &#123;
    const text = (event.target as HTMLInputElement).value;
    this.displayValue.set(text);

    const parsed = parseDuration(text);
    if (parsed !== null) &#123;
      this.value.set(parsed);        // update model
      this.parseError.set(null);
    &#125; else &#123;
      this.parseError.set('Invalid');
    &#125;
  &#125;
&#125;

// Parent form adds parse validation:
validate(f.duration, () =&gt; &#123;
  if (this.durationInput.parseError()) &#123;
    return &#123; kind: 'parse', message: '...' &#125;;
  &#125;
  return undefined;
&#125;);</pre>
          </div>
        </details>
      </section>

      <section class="exercise-section">
        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>Duration parsing logic (click to expand)</span>
          </summary>
          <div class="hint-content">
            <pre class="code-block">function parseDuration(text: string): number | null &#123;
  const hourMatch = text.match(/(\d+)\s*h/);
  const minMatch = text.match(/(\d+)\s*m/);
  if (!hourMatch &amp;&amp; !minMatch) return null;
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const mins = minMatch ? parseInt(minMatch[1]) : 0;
  return hours * 60 + mins;
&#125;

function formatDuration(minutes: number): string &#123;
  if (minutes &lt;= 0) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return \`\$&#123;m&#125;m\`;
  if (m === 0) return \`\$&#123;h&#125;h\`;
  return \`\$&#123;h&#125;h \$&#123;m&#125;m\`;
&#125;</pre>
          </div>
        </details>
      </section>
    </div>
  `,
  styles: [`
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .field-hint {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: #868e96;
    }

    .debug-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .debug-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;

      .debug-label {
        display: block;
        font-size: 0.75rem;
        color: #6c757d;
        text-transform: uppercase;
        margin-bottom: 0.25rem;
      }

      .debug-value {
        font-size: 1.25rem;
        font-weight: 600;
        color: #495057;
      }
    }

    .state-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 1rem;
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
export class TransformedValueComponent {
  protected readonly successMessage = signal<string | null>(null);

  protected readonly eventModel = signal<EventFormModel>({
    eventName: '',
    duration: 0,
    ticketPrice: 0,
    maxAttendees: 50
  });

  protected readonly eventForm = form(this.eventModel, (f) => {
    required(f.eventName);
    // TODO 3: Add validators for duration and ticketPrice
    // required(f.duration);
    // min(f.duration, 15);       // at least 15 minutes
    // required(f.ticketPrice);
    // min(f.ticketPrice, 100);   // at least $1.00 (100 cents)

    // TODO 4: Add parse error validation (integrate with child component)
    // validate(f.duration, () => {
    //   if (this.durationInput?.parseError()) {
    //     return { kind: 'parse', message: 'Invalid duration format' };
    //   }
    //   return undefined;
    // });
  });

  onSubmit() {
    this.successMessage.set(null);
    if (this.eventForm().valid()) {
      const val = this.eventForm().value();
      this.successMessage.set(
        `Event "${val.eventName}" created! Duration: ${val.duration}min, Price: $${(val.ticketPrice / 100).toFixed(2)}`
      );
    }
  }
}
