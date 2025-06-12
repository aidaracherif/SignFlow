import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Breadcrumb } from './breadcrumb.model';
import { BreadcrumbService } from './breadcrumb.service';
import { RouterLink } from '@angular/router';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.css'],
    imports: [NgFor, RouterLink, AsyncPipe],
    standalone: true
})
export class BreadcrumbComponent implements OnInit {

  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private readonly breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }
  ngOnInit(): void {

  }
}
