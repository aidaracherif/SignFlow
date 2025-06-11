import { Component, Input, HostListener, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadMoreComponent } from "../read-more/read-more.component";

@Component({
  selector: "app-card-item-domaine",
  standalone: true,
  templateUrl: "./card-item-domaine.component.html",
  styleUrls: ["./card-item-domaine.component.css"],
  imports: [CommonModule, ReadMoreComponent, ReadMoreComponent],
})
export class CardItemDomaineComponent {

  @Input() image!: string;
  @Input() name!: string;
  @Input() description!: string;

  @Output() callback = new EventEmitter<void>();

  onCardClick() {
    this.callback.emit();
  }
}
