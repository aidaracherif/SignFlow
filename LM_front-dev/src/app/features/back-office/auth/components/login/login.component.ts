import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { ApiService } from '../../../../../shared/services/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],  
  providers: [ApiService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  host: {
    'ngSkipHydration': ''
  },
})
export class LoginComponent {
  email = '';
  motDePasse = '';

  constructor(private apiService: ApiService, private router: Router) {}  

  onSubmit() {
    console.log('Email:', this.email);
    console.log('Mot de Passe:', this.motDePasse);

    const payload = {
      email: this.email,
      motDePasse: this.motDePasse
    };

    this.apiService.post('/login', payload).subscribe({
      next: (response:any) => {
        console.log('Réponse backend:', response);
        localStorage.setItem('token', response.token);

    if (response && response.token) {
      this.router.navigate(['/dashboard']); 
    }

      },
      error: (err) => {
        console.error('Erreur backend:', err);
      }
    });
  }
}