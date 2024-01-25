import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
      private snackBar: MatSnackBar
  ) { }


  notify(text: string): void{
    this.snackBar.open(text, 'ok', { duration: 3000 });
  }
}
