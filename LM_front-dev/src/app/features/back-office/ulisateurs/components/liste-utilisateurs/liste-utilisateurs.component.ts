import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-liste-utilisateurs',
    standalone: true,
    imports: [TableModule, CommonModule],
    templateUrl: './liste-utilisateurs.component.html',
    styleUrl: './liste-utilisateurs.component.css',
})
export class ListeUtilisateursComponent implements OnInit {
  products = [
      { code: 'P001', name: 'Product 1', category: 'Category 1', quantity: 10 },
      { code: 'P002', name: 'Product 2', category: 'Category 2', quantity: 20 },
      { code: 'P003', name: 'Product 3', category: 'Category 3', quantity: 15 },
      { code: 'P004', name: 'Product 4', category: 'Category 1', quantity: 25 },
  ];

  ngOnInit() {
      // Aucune action nécessaire ici, les données sont déjà disponibles.
  }
}
