import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PartidosComponent } from './partidos/partidos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ReservasComponent } from './reservas/reservas.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {path: 'partidos', component: PartidosComponent},
      {path: 'perfil', component: PerfilComponent},
      {path: 'reservas', component: ReservasComponent},
      {path: '', redirectTo: 'partidos', pathMatch: 'full'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMainRoutingModule { }
