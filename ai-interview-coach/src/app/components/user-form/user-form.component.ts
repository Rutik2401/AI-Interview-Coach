import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule, CommonModule, FooterComponent],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  name = '';
  role = '';
  experience: any;
  constructor( private router: Router) { }

  startInterview() {
    if (this.name && this.role && this.experience) {
      sessionStorage.setItem('name', this.name);
      sessionStorage.setItem('role', this.role);
      sessionStorage.setItem('experience', this.experience);
      this.router.navigate(['/interview']);
    } else {
      alert('Please fill all fields');
    }
  }
}
