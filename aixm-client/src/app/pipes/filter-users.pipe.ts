import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/auth/user';

@Pipe({
    name: 'filterUser',
})
/**
 * Filter User
 */
export class FilterUsersPipe implements PipeTransform {
  transform(users: User[], searchText: string): any[] {
    if (!users) {
      return [];
    }
    if (!searchText) {
      return users;
    }
    searchText = searchText.toLowerCase();
    return users.filter((user: User) =>
      (user.email ? user.email.toLocaleLowerCase().includes(searchText) : false) ||
      (user.firstName ? user.firstName.toLocaleLowerCase().includes(searchText) : false) ||
      (user.lastName ? user.lastName.toLocaleLowerCase().includes(searchText) : false) ||
      (user.company ? user.company.toLocaleLowerCase().includes(searchText) : false) ||
      (user.position ? user.position.toLocaleLowerCase().includes(searchText) : false)
    );
  }
}
