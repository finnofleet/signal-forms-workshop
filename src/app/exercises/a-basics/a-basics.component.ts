/*
 * ================================================================
 * A – Signal Forms Basics
 * ================================================================
 * Learning goals:
 *  - Create a reactive model with signal()
 *  - Initialize a form with form()
 *  - Bind inputs with [formField]
 *  - Read the current form value
 *  - Structure nested data with schema() and apply()
 *  - Handle arrays with applyEach()
 *
 * ✅ PART A – Done when the live preview reflects your typing      (10 min)
 * ✅ PART B – Done when the address fields bind correctly          (10 min)
 * ✅ PART C – Done when Add / Remove skill buttons work            (10 min)
 *
 * 💡 Hints are in the collapsible sections at the bottom of the page.
 * ================================================================
 */

import { Component, signal } from '@angular/core';
import { form, FormField, schema, apply, applyEach } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';

// ─── Part B ──────────────────────────────────────────────────────────────────
// TODO B-1: Define an addressSchema.
//
// schema() creates a reusable form schema for a specific type (address with fields, street, city, country).
// Declare it outside the component so it can be reused across forms.
// No validators needed yet — that is Exercise B territory.
//
// const addressSchema = schema<{
// }>((_addr) => {
//   // validators go here in Exercise B
// });

@Component({
  selector: 'app-a-basics',
  standalone: true,
  imports: [FormField, JsonPipe],
  templateUrl: './a-basics.component.html',
  styleUrl: './a-basics.component.css'
})
export class ABasicsComponent {

  // ─── Part A ────────────────────────────────────────────────────────────────
  // signal() turns a plain object into a reactive value.
  // Any write to this signal (via .set() or .update()) triggers re-rendering.
  //
  // The shape here drives the entire form — every property becomes a Field.
  protected readonly profileModel = signal({
    firstName: '',
    lastName:  '',
    role:      '',
    age:       0,
    // TODO A-1: Include a string field for 'bio' and wire up the [formField] in the template (see TODO A-2).
    // After saving, watch the live preview update as you type.

    // Part B ↓ (uncomment when you reach Part B)
    address: {
      street:  '',
      city:    '',
      country: '',
    },

    // Part C ↓ — already here so the template compiles
    skills: [
      { id: crypto.randomUUID(), name: '' },
    ],
  });

  // form() wraps the model signal in a FieldTree.
  // Every property of the model becomes a Field with state: value, touched, valid, errors.
  //
  // The second argument is the schema function — this is where validators,
  // nested schemas, and array schemas are declared.
  protected readonly profileForm = form(this.profileModel, (f) => {

    // TODO B-2: Activate the address schema.
    //   Apply the address schema from TODO B-1.
    //   apply() tells the form to use addressSchema for the nested address object.

    // applyEach() is already wired so the template can iterate over skills.
    // Even without validators it is required for array items to become FieldTrees.
    applyEach(f.skills, (_skill) => {
      // Skill-level validators go here in Exercise B.
    });
  });

  // ─── Part C ────────────────────────────────────────────────────────────────
  // TODO C-1: Add a new empty skill to the list.
  // Signal updates must be immutable — always return a new object.
  addSkill(): void {
  }

  // TODO C-2: Remove the skill at the given index.
  removeSkill(_index: number): void {
  }
}
