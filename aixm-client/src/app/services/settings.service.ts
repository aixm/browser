import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor() { }

  setValue(code: string, value: string): void {
    localStorage.setItem(code, value);
  }

  getValue(code: string, defaultValue: string): string {
    const val: string | null = localStorage.getItem(code);
    return val ? val : defaultValue;
  }

  removeValue(code: string): void {
    localStorage.removeItem(code);
  }

}
