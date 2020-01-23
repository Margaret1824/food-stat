import { UserComponent } from './user/user.component';
import { ChatComponent } from './chat/chat.component';
import { AppComponent } from './app.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'user/:id', component: UserComponent },
    { path: 'chat/:id', component: ChatComponent },
    { path: '', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { } 