import { Injectable } from '@angular/core';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  userData: User;

  constructor() { }

  store(user: User): void { this.userData = user };
  get(): User { return this.userData };

}