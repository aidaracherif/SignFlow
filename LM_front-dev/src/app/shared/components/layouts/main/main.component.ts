import { CommonModule } from '@angular/common';
import { Component,  } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
    imports: [
        CommonModule,
        RouterOutlet,
        RouterModule,
        SidebarComponent
    ]
})
export class MainComponent {

  constructor(
  ) { }

  ngOnInit(): void {

  }

}
