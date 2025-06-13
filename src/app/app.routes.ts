import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/characters',
    pathMatch: 'full',
  },
  {
    path: 'characters',
    loadComponent: () =>
      import(
        './features/characters/components/character-list/character-list'
      ).then((m) => m.CharacterListComponent),
  },
  {
    path: 'characters/:id',
    loadComponent: () =>
      import(
        './features/characters/components/character-detail/character-detail'
      ).then((m) => m.CharacterDetailComponent),
  },
  {
    path: 'villages',
    loadComponent: () =>
      import('./features/villages/components/village-list/village-list').then(
        (m) => m.VillageListComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/characters',
  },
];
