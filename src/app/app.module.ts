import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { UserComponent } from './user/user.component';
import { ChatComponent } from './chat/chat.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatCardModule } from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle'; 
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'TestProject'),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AppRoutingModule, 
    BrowserAnimationsModule, 
    MatTableModule, MatCardModule, MatButtonToggleModule, MatSortModule
  ],
  declarations: [ AppComponent, UserComponent, ChatComponent ],
  bootstrap: [ AppComponent ]
})

export class AppModule {}