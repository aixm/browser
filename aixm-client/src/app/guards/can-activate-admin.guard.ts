import { inject }                                                             from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User }                                                               from '../models/auth/user';
import { AuthService }   from '../services/auth.service';

export const canActivateAdminGuard: CanActivateFn = (): boolean | Promise<boolean> => {
  const user: User | null = inject(AuthService).User;
  const router: Router = inject(Router);

  return user?.role === 'admin' || router.navigate(['forbidden']);

};
