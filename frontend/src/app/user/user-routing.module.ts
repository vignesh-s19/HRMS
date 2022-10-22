import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';

import { childRoutes } from './child-routes';
import { UserTableComponent } from './user-table/user-table.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard'
      },
      {
        path: 'users',
        component: UserTableComponent,
       
      },
      ...childRoutes
    ]
  },
  // {
  //   path: 'user',
  //   component: UserTableComponent,
   
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
