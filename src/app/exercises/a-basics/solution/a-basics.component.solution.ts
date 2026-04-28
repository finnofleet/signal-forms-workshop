import { Component, signal } from '@angular/core';
import { form, FormField, schema, apply, applyEach } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';

const addressSchema = schema<{
  street:  string;
  city:    string;
  country: string;
}>((_addr) => {});

@Component({
  selector: 'app-a-basics-solution',
  standalone: true,
  imports: [FormField, JsonPipe],
  templateUrl: './a-basics.component.solution.html',
  styleUrl: '../a-basics.component.css'
})
export class ABasicsSolutionComponent {

  protected readonly profileModel = signal({
    firstName: '',
    lastName:  '',
    role:      '',
    age:       0,
    bio:       '',
    address: {
      street:  '',
      city:    '',
      country: '',
    },
    skills: [
      { id: crypto.randomUUID(), name: '' },
    ],
  });

  protected readonly profileForm = form(this.profileModel, (f) => {
    apply(f.address, addressSchema);
    applyEach(f.skills, (_skill) => {});
  });

  addSkill(): void {
    this.profileModel.update(current => ({
      ...current,
      skills: [...current.skills, { id: crypto.randomUUID(), name: '' }],
    }));
  }

  removeSkill(index: number): void {
    const skills = this.profileModel().skills;
    skills.splice(index, 1);
    this.profileModel.set({ ...this.profileModel(), skills });
  }
}
