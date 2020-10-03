import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ContatosComponent } from './contatos/contatos.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { EventosComponent } from './eventos/eventos.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent }
    ]
  },


  { path: 'eventos', component: EventosComponent, canActivate: [AuthGuard] },
  { path: 'palestrantes', component: PalestrantesComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashbordComponent, canActivate: [AuthGuard] },
  { path: 'contatos', component: ContatosComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashborad', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
