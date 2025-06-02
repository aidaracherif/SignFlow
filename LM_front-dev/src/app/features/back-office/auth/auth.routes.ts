import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { MainguestComponent } from "../../../shared/components/layouts/mainguest/mainguest.component";




export const authRoutes: Routes = [
  {
    path: '',
    component: MainguestComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },

      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]
  }
];
