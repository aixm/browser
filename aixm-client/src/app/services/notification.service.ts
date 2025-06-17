import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);



  notify(text: string): void{
    this.snackBar.open(text, 'ok', { duration: 3000 });
  }
}
