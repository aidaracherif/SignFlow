import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardItemDomaineComponent } from './card-item-domaine.component';

describe('CardItemDomaineComponent', () => {
  let component: CardItemDomaineComponent;
  let fixture: ComponentFixture<CardItemDomaineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardItemDomaineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardItemDomaineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
