import { Component } from '@angular/core';

@Component({
    selector: "app-footer-portail",
    imports: [],
    templateUrl: "./footer-portail.component.html",
    styleUrl: "./footer-portail.component.css"
})
export class FooterPortailComponent {
  
  phone = {
    value: "+221 77 777 77 77",
    link: "tel:+221777777777",
  };

  email = {
    value: "contact@gmail.com",
    link: "mailto:contact@gmail.com",
  };

  address = {
    value: "Kédougou, Sénégal",
    link: "https://maps.app.goo.gl/hVY8p2kagD6DQwU48",
  };
}
