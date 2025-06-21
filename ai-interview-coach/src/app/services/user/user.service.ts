import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private name = '';
  private role = '';

  setUser(name: string, role: string) {
    this.name = name;
    this.role = role;
  }

  getUser() {
    return { name: this.name, role: this.role };
  }
}
