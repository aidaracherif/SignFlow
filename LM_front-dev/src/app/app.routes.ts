import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import("./features/back-office/auth/auth.routes").then(
        (routes) => routes.authRoutes
      ),
  },
  {
    path: "utilisateurs",
    loadChildren: () =>
      import("./features/back-office/ulisateurs/user.routes").then(
        (routes) => routes.userRoutes
      ),
  },

  { path: "", redirectTo: "auth", pathMatch: "full" },

];
