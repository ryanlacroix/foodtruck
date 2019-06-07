import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    console.log('in dashboard');
    console.log(this.userDataService.get());
  }

}
