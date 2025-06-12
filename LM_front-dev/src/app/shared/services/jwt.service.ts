import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private tokenKey: string = 'token';

  constructor() { }

  // Récupérer le token depuis sessionStorage
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  // Stocker le token dans sessionStorage
  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  // getCurrentUser(): User {
  //   const decoded: any = this.decodeToken()
  //   return decoded.user as User
  // }

  getCurrentUser() : any {
  }
  // Supprimer le token de sessionStorage
  removeToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  // Décoder le token
  decodeToken() {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return 'inconnue';
  }

  // Vérifier si le token est expiré
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    const decoded: any = this.decodeToken();
    if (!decoded || !decoded.exp) {
      return true;
    }
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decoded.exp);
    return expirationDate < new Date();
  }

  // Récupérer la date d'expiration du token
  getTokenExpirationDate(): Date | null {
    const decoded: any = this.decodeToken();
    if (!decoded || !decoded.exp) {
      return null;
    }
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decoded.exp);
    return expirationDate;
  }
}
