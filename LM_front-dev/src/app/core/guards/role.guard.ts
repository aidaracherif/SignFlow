import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { JwtService } from '../../shared/services/jwt.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  private _jwt = inject(JwtService);
  private _router = inject(Router);
  constructor() {}

  canActivate( route: ActivatedRouteSnapshot,
               state: RouterStateSnapshot): boolean {
    const authorizedRoles = route?.data?.['role'];
    const userRoles = this._jwt.getCurrentUser().profil.code; // A adapter selon la structure de votre token

    if (authorizedRoles.includes('*')) {
      return true;
    }

    if (authorizedRoles.includes(userRoles)) {
      return true;
    } else {
      this._router.navigateByUrl('/');
      return false;
    }
  }
}
export const RoleGuardForChild : CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(RoleGuard).canActivate(route, state);
}
