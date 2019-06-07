import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = "";
  password: string = "";
  wrongCredentials: boolean = false;
  success: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private userDataService: UserDataService
  ) { }

  public sendCredentials(): void {
    this.loginService.sendLogin(this.username, this.password)
      .subscribe(result => {
        if (result.error) { this.wrongCredentials = true; }
        else { this.loginSuccess(result); }
      });
  }
  private loginSuccess(user): void {
    this.success = true;
    this.wrongCredentials = false;
    this.userDataService.store(user)
    // Start a timer then redirect to user dashboard
    const successTimer = timer(2000);
    successTimer.subscribe(_ => {
      console.log('redirecting..');
      this.router.navigateByUrl('dashboard');
    });
  }
  ngOnInit() {
  }

}