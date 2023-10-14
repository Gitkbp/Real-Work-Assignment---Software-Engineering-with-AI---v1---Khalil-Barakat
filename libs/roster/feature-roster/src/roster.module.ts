import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ROSTER_ROUTES } from './roster.routes';  // <-- Add this import
import { RosterComponent } from './roster.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROSTER_ROUTES)  // <-- Use forChild with ROSTER_ROUTES
  ],
  declarations: [RosterComponent]
})
export class RosterModule { }