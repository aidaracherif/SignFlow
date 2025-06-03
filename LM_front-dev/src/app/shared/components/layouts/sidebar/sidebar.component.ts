import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-sidebar',
    imports: [BreadcrumbComponent, RouterModule, CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  constructor() { }
  menuItems: { label: string, path: string, icon: string }[] = [


    {
      label: 'Tableau de bord',
      path: '/dashboard',
      icon: 'dashboard'
    },
    {
      label: 'Liste ',
      path: '/utilisateurs',
      icon: 'list'
    },
    // {
    //   label: 'Formulaire',
    //   path: '/utilisateurs/nouvel-utilisateur',
    //   icon: 'bx bxs-edit'
    // },

  ];

  ngOnInit(): void {

  }

}
