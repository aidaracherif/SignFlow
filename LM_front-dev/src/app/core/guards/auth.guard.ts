import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { JwtService } from '../../shared/services/jwt.service';



@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  private _jwt = inject(JwtService);
  private _router = inject(Router);
  url !: string
  constructor() {}

  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean {
      const token: string | null = this._jwt.getToken();
      this.url = state.url;

      if (token != null) {
        if (this._jwt.isTokenExpired()) {
          this._router.navigate([''], {
            queryParams: { returnUrl: state.url }
          });
          this._jwt.removeToken();
          return false;
        } else {
            if (this.url.includes('auth')) { // cas où l'utilisateur s'est déja connecté et il souhaite revenir sur la page login
              return false;
            }
          return true;
        }
      }
      this._router.navigate([''], {
        queryParams: { returnUrl: state.url }
      });
    return false;
  }
}


export const AuthGuardForChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthGuard).canActivate(route, state);
}
