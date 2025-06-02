import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleUtilisateurComponent } from './single-utilisateur.component';

describe('SingleUtilisateurComponent', () => {
  let component: SingleUtilisateurComponent;
  let fixture: ComponentFixture<SingleUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleUtilisateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
