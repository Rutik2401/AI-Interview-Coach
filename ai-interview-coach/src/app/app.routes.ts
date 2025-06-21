import { Routes } from '@angular/router';
import { StartComponent } from './components/start/start.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { InterviewComponent } from './components/interview/interview.component';

export const routes: Routes = [
    { path: '', component: StartComponent },
    { path: 'form', component: UserFormComponent },
    { path: 'interview', component: InterviewComponent },
];
