import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/01-basics',
    pathMatch: 'full'
  },
  {
    path: '01-basics',
    loadComponent: () => import('./exercises/01-basics/basics.component').then(m => m.BasicsComponent),
    title: 'Signal Forms - Basics'
  },
  {
    path: '02-validation',
    loadComponent: () => import('./exercises/02-validation/validation.component').then(m => m.ValidationComponent),
    title: 'Signal Forms - Validation'
  },
  {
    path: '03-schemas',
    loadComponent: () => import('./exercises/03-schemas/schemas.component').then(m => m.SchemasComponent),
    title: 'Signal Forms - Schemas'
  },
  {
    path: '04-custom-controls',
    loadComponent: () => import('./exercises/04-custom-controls/custom-controls.component').then(m => m.CustomControlsComponent),
    title: 'Signal Forms - Custom Controls'
  },
  {
    path: '05-async-submit',
    loadComponent: () => import('./exercises/05-async-submit/async-submit.component').then(m => m.AsyncSubmitComponent),
    title: 'Signal Forms - Async & Submit'
  },
  {
    path: '06-array-basic',
    loadComponent: () => import('./exercises/06-array-basic/array-basic.componen.solution').then(m => m.ArrayBasicsComponent),
    title: 'Signal Forms - Arrays'
  },
  {
    path: '07-model-design',
    loadComponent: () => import('./exercises/07-model-design/model-design.component').then(m => m.ModelDesignComponent),
    title: 'Signal Forms - Model Design'
  },
  {
    path: '08-submit-formroot',
    loadComponent: () => import('./exercises/08-submit-formroot/submit-formroot.component').then(m => m.SubmitFormrootComponent),
    title: 'Signal Forms - Submit & FormRoot'
  },
  {
    path: '09-subforms',
    loadComponent: () => import('./exercises/09-subforms/subforms.component').then(m => m.SubformsComponent),
    title: 'Signal Forms - Subforms'
  },
  {
    path: '10-transformed-value',
    loadComponent: () => import('./exercises/10-transformed-value/transformed-value.component').then(m => m.TransformedValueComponent),
    title: 'Signal Forms - Transformed Value'
  },
  {
    path: '**',
    redirectTo: '/01-basics'
  }
];
