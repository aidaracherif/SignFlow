import { Injectable, Inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: "root",
})
export class PlatformService {
  public isBrowser = isPlatformBrowser(this.document);

  constructor(@Inject(DOCUMENT) private document: any) {}

  isLocalStorageAvailable(): boolean {
    return this.isBrowser && typeof window.localStorage !== "undefined";
  }

  detectMobileDevice(): boolean {
    const screenWidth =
      window.innerWidth ||
      this.document.documentElement.clientWidth ||
      this.document.body.clientWidth;
    // const screenWidth = window.innerWidth;
    if (screenWidth <= 768) {
      // Si la largeur de l'écran est inférieure ou égale à 768 pixels, considérer comme un appareil mobile
      return true;
    } else {
      // Sinon, considérer comme un autre type d'appareil (par exemple, un ordinateur de bureau)
      return false;
    }
  }
}
