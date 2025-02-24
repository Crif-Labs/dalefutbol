import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserMainRoutingModule } from './user-main-routing.module';
import { AuthService } from '../../services/auth.service';
import { AuthModule } from '@angular/fire/auth';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserMainRoutingModule,
    AuthModule
  ],
  providers: [AuthService]
})
export class UserMainModule { }
