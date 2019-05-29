import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardsModule } from './cards/cards.module';
import { MatchesService } from './cards/matches.service';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem, MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import { PredictionHistoryComponent } from './prediction-history/prediction-history.component';
import { LeadershipBoardComponent } from './leadership-board/leadership-board.component';
import {UserManagementModule} from './user-management/user-management.module';
import {ToastModule} from 'primeng/toast';
import {PredictionPipe} from './pipes/Prediction.pipe';
import {Ng4LoadingSpinnerModule} from 'ng4-loading-spinner';
import { RulesComponent } from './rules/rules.component';




@NgModule({
  declarations: [
    AppComponent,
    PredictionHistoryComponent,
    LeadershipBoardComponent,
    PredictionPipe,
    RulesComponent
  ],
  imports: [
    TableModule,
    ButtonModule,
    MenubarModule,
    BrowserModule,
    AppRoutingModule,
    CardsModule,
    UserManagementModule,
    ToastModule,
    Ng4LoadingSpinnerModule
  ],
  providers: [MatchesService, MessageService],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
