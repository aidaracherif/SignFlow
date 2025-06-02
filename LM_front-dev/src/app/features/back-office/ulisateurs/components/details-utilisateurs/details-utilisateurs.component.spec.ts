import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsUtilisateursComponent } from './details-utilisateurs.component';

describe('DetailsUtilisateursComponent', () => {
  let component: DetailsUtilisateursComponent;
  let fixture: ComponentFixture<DetailsUtilisateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsUtilisateursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsUtilisateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
