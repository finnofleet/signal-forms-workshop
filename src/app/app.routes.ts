import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/01-basics',
    pathMatch: 'full'
  },
  // Module 1: Foundations
  {
    path: '01-basics',
    loadComponent: () => import('./exercises/01-basics/basics.component').then(m => m.BasicsComponent),
    title: 'Signal Forms - Basics'
  },
  // Module 2: Form Model Design
  {
    path: '02-model-design',
    loadComponent: () => import('./exercises/02-model-design/model-design.component').then(m => m.ModelDesignComponent),
    title: 'Signal Forms - Model Design'
  },
  // Module 3: Validation Deep Dive
  {
    path: '03-validation',
    loadComponent: () => import('./exercises/03-validation/validation.component').then(m => m.ValidationComponent),
    title: 'Signal Forms - Validation'
  },
  {
    path: '04-async-submit',
    loadComponent: () => import('./exercises/04-async-submit/async-submit.component').then(m => m.AsyncSubmitComponent),
    title: 'Signal Forms - Async & Submit'
  },
  {
    path: '05-submit-formroot',
    loadComponent: () => import('./exercises/05-submit-formroot/submit-formroot.component').then(m => m.SubmitFormrootComponent),
    title: 'Signal Forms - Submit & FormRoot'
  },
  // Module 4: Scalable Architectures
  {
    path: '06-schemas',
    loadComponent: () => import('./exercises/06-schemas/schemas.component').then(m => m.SchemasComponent),
    title: 'Signal Forms - Schemas'
  },
  {
    path: '07-custom-controls',
    loadComponent: () => import('./exercises/07-custom-controls/custom-controls.component').then(m => m.CustomControlsComponent),
    title: 'Signal Forms - Custom Controls'
  },
  {
    path: '08-arrays',
    loadComponent: () => import('./exercises/08-arrays/array-basic.component').then(m => m.ArrayBasicsComponent),
    title: 'Signal Forms - Arrays'
  },
  {
    path: '09-subforms',
    loadComponent: () => import('./exercises/09-subforms/subforms.component').then(m => m.SubformsComponent),
    title: 'Signal Forms - Subforms'
  },
  {
    path: '**',
    redirectTo: '/01-basics'
  }
];
