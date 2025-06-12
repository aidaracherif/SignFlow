import { Routes } from "@angular/router";
import { AccueilComponent } from "./accueil/accueil.component";
import { MainComponent } from "../../../shared/components/layouts/main/main.component";




export const dashboardRoutes: Routes = [
  {
    path: '',
    component: MainComponent,

    children: [
        {
            path: '',
            component: AccueilComponent
        }
    ]
  }

];
