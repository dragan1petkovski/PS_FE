import { Routes } from '@angular/router';
import { LoginComponent } from './loginPage/login.component';
import { HomepageComponent } from './homePage/homepage.component';
import { AdminageComponent } from './adminPage/AdminPage.component';
export const routes: Routes = [
    //Position of the route is very important, MOST SPECIFIC FIRST
    {path: 'admin', component: AdminageComponent},
    {path: 'home', component: HomepageComponent},
    {path: '', component: LoginComponent},
];

// export const routing = RouterModule.forRoot(routes);