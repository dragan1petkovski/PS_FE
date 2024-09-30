import { Routes } from '@angular/router';
import { LoginComponent } from './loginPage/login.component';
import { HomepageComponent } from './homePage/homepage.component';
import { AdminageComponent } from './adminPage/AdminPage.component';
import { canActivateAdministrator, canActivateUser } from './utility/authentication.service';

export const routes: Routes = [
    //Position of the route is very important, MOST SPECIFIC FIRST
    {path: 'admin', component: AdminageComponent, canActivate: [canActivateAdministrator]},
    {path: 'home', component: HomepageComponent, canActivate: [canActivateUser]},
    {path: "", component: LoginComponent},
    {path: "**", redirectTo: ''}
];

// export const routing = RouterModule.forRoot(routes);