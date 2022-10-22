export const childRoutes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('src/app/dashboard/dashboard.module').then(m => m.DashboardModule),
    data: { icon: 'dashboard', text: 'Dashboard' }
  },
  {
    path: 'employee',
    loadChildren: () =>
      import('src/app/employees/employeeDetails.module').then(
        m => m.EmployeeDetailsModule
      ),
    data: { icon: 'assignment', text: 'EmployeeDetails' }
  },
  {
    path: 'users',
    loadChildren: () =>
      import('src/app/user/user.module').then(
        m => m.UserModule
      ),
    data: { icon: 'table_chart', text: 'User' }
  },
 
  
  {
    path: 'user',
    loadChildren: () =>
      import('src/app/user/profile/profile.module').then(
        m => m.ProfileModule
      ),
    data: { icon: 'assignment', text: 'Profile' }
  },
];
