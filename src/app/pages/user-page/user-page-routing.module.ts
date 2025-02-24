import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PartidosComponent } from './partidos/partidos.component';
import { ChatComponent } from './chat/chat.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ReservaComponent } from './reserva/reserva.component';
import { TorneoComponent } from './torneo/torneo.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {path: 'partidos', component: PartidosComponent},
      {path: 'chat', component: ChatComponent},
      {path: 'perfil', component: PerfilComponent},
      {path: 'reserva', component: ReservaComponent},
      {path: 'torneo', component: TorneoComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserPageRoutingModule { }
