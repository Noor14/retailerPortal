import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from './login.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('longContent', { static: false }) longContent: ElementRef;

  userCredentials = { "grant_type": "password" };
  loginCredentials: any = {};
  loginFailure: boolean = false;
  constructor(private loginService: LoginService, private toast: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit() {
  }
  check(status) {
    if (status) {
      this.loginService.login(this.userCredentials)
        .then(data => {
          this.loginCredentials = data;
          console.log(data);
          if (this.loginCredentials.ErrorCode) {
            this.loginFailure = true;
          }
          else {
            if (this.loginCredentials.UserAccount.IsTermAndConditionAccepted == 0) {
              this.modalService.open(this.longContent, { scrollable: true, size: 'lg' });
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
    else {
      this.loginFailure = true;

    }



  }
}
