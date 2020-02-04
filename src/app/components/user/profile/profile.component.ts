import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppPattern, AppMasks } from 'src/app/shared/app.mask';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  objProfile: any;
  profileFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  passToggle = false;
  newToggle = false;
  confirmToggle = false;
  public cnicMask = AppMasks.cnic_Mask;
  public mobileMask = AppMasks.mobile_Mask;
  constructor(private _profileService: ProfileService,private _toastr:ToastrService) { }

  ngOnInit() {
    this.profileFormGroup = new FormGroup({
      ID: new FormControl("", [Validators.required, Validators.min(0)]),
      Name: new FormControl("", [Validators.required]),
      RetailerCode: new FormControl({value:"",disabled:true}, [Validators.required]),
      Email: new FormControl("", [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      Mobile: new FormControl("", [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      CNIC: new FormControl("", [Validators.required, Validators.pattern(AppPattern.cnic_Pattern)]),
      Address: new FormControl("", [Validators.required]),
      CreatedDate: new FormControl("", [Validators.required]),
      CompanyName: new FormControl("", [Validators.required]),
      
    });
     
      this.passwordFormGroup = new FormGroup ({
        Username: new FormControl(JSON.parse(sessionStorage.getItem('userIdentity')).UserAccount.Username,[Validators.required]),
        Password: new FormControl("",[Validators.required,Validators.pattern(AppPattern.password)]),
        ConfirmPassword: new FormControl("",[Validators.required,Validators.pattern(AppPattern.password)]),
        NewPassword: new FormControl("",[Validators.required,Validators.pattern(AppPattern.password)]),

        
      })
    this.loadProfile();
  }

  loadProfile() {
    this._profileService.getById(JSON.parse(sessionStorage.getItem('userIdentity')).UserAccount.RetailerID, 1, "retailer/")
      .then((data: any) => {
        this.objProfile = data;
        this.profileFormGroup.setValue(
          {
            ID:data.ID,
            Name: data.Name,
            RetailerCode: data.RetailerCode,
            Email: data.Email,
            Mobile: data.Mobile,
            CNIC: data.CNIC,
            Address: data.Address,
            CreatedDate: data.CreatedDate,
            CompanyName: data.CompanyName,
          }
        )

      })
      .catch(err => {
        console.log(err);
      })
  }

  changePassword(){
    this._profileService.postCalls(this.passwordFormGroup.value,8,"users/ChangePassword")
    .then((data:any)=>{
      console.log(data);
    })
    .catch(err=>{
      console.log(err);
      if(err.error.status==405){
        this._toastr.error(err.error.message,"Error")
      }
    })
  }

  updateProfile(){
    this._profileService.postCalls(this.profileFormGroup.value,8,"retailer/Save")
    .then((data:any)=>{
      console.log(data);
    })
    .catch(err=>{
      console.log(err);
      if(err.error.status==405){
        this._toastr.error(err.error.message,"Error")
      }
    })
  }

}
