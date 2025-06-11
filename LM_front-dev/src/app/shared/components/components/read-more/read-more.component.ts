import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-read-more',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.css']
})
export class ReadMoreComponent implements OnInit {
  @Input() content!: string;
  @Input() limit!: number;
  @Input() completeWords!: boolean;

  isContentToggled = false;
  truncatedContent!: string;
  fullContent!: string;

  ngOnInit() {
    this.fullContent = this.content;
    this.truncatedContent = this.formatContent(this.content);
  }

  toggleContent() {
    this.isContentToggled = !this.isContentToggled;
  }

  formatContent(content: string): string {
    if (this.completeWords) {
      this.limit = content.substr(0, this.limit).lastIndexOf(' ');
    }
    return `${content.substr(0, this.limit)}...`;
  }

  get displayContent(): string {
    return this.isContentToggled ? this.fullContent : this.truncatedContent;
  }
}
