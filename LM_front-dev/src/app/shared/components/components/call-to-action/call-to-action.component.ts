import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import AOS from "aos";

@Component({
    selector: 'app-call-to-action',
    imports: [],
    templateUrl: './call-to-action.component.html',
    styleUrl: './call-to-action.component.css'
})
export class CallToActionComponent implements OnInit {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        offset: 200,
        duration: 600,
        easing: 'ease-in-sine',
        delay: 100,
        disable: 'mobile'
      });
    }
  }

  onViewDetails() {
    this.router.navigateByUrl(`contact`)
  }

}
