import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-start',
  imports: [FooterComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {
  constructor(private router: Router) {

  }
  goToForm() {
    this.router.navigate(['/form']);
  }
}
