import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-card-article',
    imports: [CommonModule],
    templateUrl: './card-article.component.html',
    styleUrl: './card-article.component.css'
})
export class CardArticleComponent {

  @Input() image!: string;
  @Input() galeriesCount!: number;
  @Input() video!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() createdDate!: string;
  @Output() callback = new EventEmitter<void>();

  onCardClick() {
    this.callback.emit();
  }
}
