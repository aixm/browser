import { inject }                                                             from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { User }                                                               from '../models/auth/user';
import { AuthService }   from '../services/auth.service';

export const canActivateAdminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> => {
  const user: User | null = inject(AuthService).User;
  const router: Router = inject(Router);

  return user?.role === 'admin' || router.navigate(['forbidden']);

};
