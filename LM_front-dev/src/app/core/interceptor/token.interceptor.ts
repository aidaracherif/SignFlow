import { HttpInterceptorFn } from '@angular/common/http';
import { JwtService } from '../../shared/services/jwt.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(JwtService).getToken();
  req = req.clone({
    setHeaders: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  });
  return next(req);
};
