import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-horiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-horiz.component.html',
  styleUrl: './card-horiz.component.css'
})
export class CardHorizComponent {

  @Input() image!: string;
  @Input() video!: string[];
  @Input() title!: string;
  @Input() description!: string;
  @Input() createdDate!: string;
  @Output() callback = new EventEmitter<void>();

  onCardClick() {
    this.callback.emit();
  }

}
