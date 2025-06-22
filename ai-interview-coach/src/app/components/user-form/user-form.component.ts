import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  name = '';
  role = '';

  constructor(private userService: UserService, private router: Router) { }

  startInterview() {
    if (this.name && this.role) {
      this.userService.setUser(this.name, this.role);
      this.router.navigate(['/interview']);
    } else {
      alert('Please fill all fields');
    }
  }
}
