/* import { Component, OnInit } from '@angular/core';
import { RosterService } from './roster.service';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html'
})
export class RosterComponent implements OnInit {
  rosterData: any[] = [];
  

  constructor(private rosterService: RosterService) {}

  ngOnInit(): void {
    this.rosterService.getRosterData().subscribe(data => {
      this.rosterData = data;
    });
  }
} */

import { Component, OnInit } from '@angular/core';
import { RosterService } from './roster.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html'
})
export class RosterComponent implements OnInit {
  rosterData$!: Observable<any[]>;

  constructor(private rosterService: RosterService) {}

  ngOnInit(): void {
    this.rosterData$ = this.rosterService.getRosterData();
  }
}
 