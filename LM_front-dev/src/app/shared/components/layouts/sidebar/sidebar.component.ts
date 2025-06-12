import { Component, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';

interface IMenu {
  menId: number;
  menPath: string;
  menTitle: string;
  menIconType: string;

  childrens?: {
    menId: number;
    menPath: string;
    menTitle: string;
  }[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [BreadcrumbComponent , RouterModule  ,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
menuState: { [key: string]: boolean } = { };
menuIconName = 'panel-right-close';
constructor(private _router: Router) {
}
menuItems: IMenu[] = [
    {
        menId: 1,
        menTitle: 'Tableu de bord',
        menPath: '/dashboard',
        menIconType: 'dashboard',
        childrens: [

        ]
    },
    {
        menId: 2,
        menTitle: 'Gestion des utilisateurs',
        menPath: '/utilisateurs',
        menIconType: 'group',
        childrens: []
    },
    {
        menId: 3,
        menTitle: 'Gestion projet',
        menPath: '/gestion-projet',
        menIconType: 'analytics',
        childrens: []
    },
    {
        menId: 4,
        menTitle: 'Gestion des tâches',
        menPath: '/gestion-tache',
        menIconType: 'list_alt',
        childrens: []
    },
    {
        menId: 5,
        menTitle: 'gestion des ressources',
        menPath: '/gestion-ressource',
        menIconType: 'manage_accounts',
        childrens: []
    },
    {
        menId: 6,
        menTitle: 'gestion des budget',
        menPath: '/gestion-budget',
        menIconType: 'point_of_sale',
        childrens: []
    },
    {
        menId: 7,
        menTitle: 'gestion des dépenses',
        menPath: '/gestion-des-depenses',
        menIconType: 'shopping_bag',
        childrens: []
    },
    {
        menId: 8,
        menTitle: 'gestion des fournisseurs',
        menPath: '/gestion-des-fournisseurs',
        menIconType: 'local_shipping',
        childrens: []
    },
    {
        menId: 9,
        menTitle: 'gestion stocks',
        menPath: '/gestion-des-stocks',
        menIconType: 'inventory_2',
        childrens: []
    },
    {
        menId: 10,
        menTitle: 'Rapport',
        menPath: '/gestion-des-rapport',
        menIconType: 'folder_copy',
        childrens: []
    },


    {
        menId: 11,
        menTitle: 'Parametrage',
        menPath: '/parametres',
        menIconType: 'settings',
        childrens: [
            {
                menId: 1,
                menTitle: 'Général',
                menPath: '/setting/general',
            },
            {
                menId: 2,
                menTitle: 'Théme',
                menPath: '/setting/membres',
            },

        ]
    }
];
ngOnInit(): void {
}

logOut() {
    this._router.navigateByUrl("/auth/login")
}

activeToggle(): void {
    const $wrapper = document.querySelector('#wrapper');
    const $sidebar = document.querySelector('#sidebar-wrapper');

    if($wrapper && $sidebar) {
    $wrapper.classList.toggle('toggled');
    $sidebar.classList.toggle('active');

    // Change icon name based on sidebar state
    this.menuIconName = this.menuIconName === 'panel-right-close' ? 'panel-left-close' : 'panel-right-close';
}
  }

isSubMenuActive(menu: any): boolean {
    return menu.childrens.some((subMenu: any) =>
        this._router.isActive(subMenu.menPath, false)
    );
}

toggleSubMenu(menu: any) {
    if (!this.menuState.hasOwnProperty(menu.menPath)) {
        this.menuState[menu.menPath] = true;
    } else {
        this.menuState[menu.menPath] = !this.menuState[menu.menPath];
    }
}

closeMenuIfNotSubMenu(event: MouseEvent, menu: any) {
    if (!this.isSubMenuActive(menu)) {
        this.toggleSubMenu(menu);
    }
    event.stopPropagation(); // Empêche la propagation de l'événement
}
}