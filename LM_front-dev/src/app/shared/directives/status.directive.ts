import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appStatus]',
})
export class StatusDirective {
  constructor(private elementRef: ElementRef) { }

  @Input() set appStatus(status: string | boolean) {
    switch (status) {

      case true:
        this.elementRef.nativeElement.style.backgroundColor =
          'rgba(10, 151, 72, 0.20)';
        this.elementRef.nativeElement.style.color = 'rgba(10, 151, 72, 1)';
        this.elementRef.nativeElement.innerHTML = 'Actif';
        break;

      case false:
        this.elementRef.nativeElement.style.backgroundColor =
          'rgba(255, 77, 79, 0.20)';
        this.elementRef.nativeElement.style.color = 'rgba(255, 77, 79, 1)';
        this.elementRef.nativeElement.innerHTML = 'Inactif';
        break;
      default:
        break;
    }
  }
}
