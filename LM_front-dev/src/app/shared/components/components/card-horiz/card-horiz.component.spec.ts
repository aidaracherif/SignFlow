import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHorizComponent } from './card-horiz.component';

describe('CardHorizComponent', () => {
  let component: CardHorizComponent;
  let fixture: ComponentFixture<CardHorizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHorizComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardHorizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
