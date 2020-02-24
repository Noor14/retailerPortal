import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProfileService } from './profile.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppPattern, AppMasks } from 'src/app/shared/app.mask';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  encapsulation: ViewEncapsulation.None,
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
  constructor(private _profileService: ProfileService,private _toast:ToastrService) { }

  ngOnInit() {
    this.profileFormGroup = new FormGroup({
      ID: new FormControl(null, [Validators.required, Validators.min(0)]),
      Name: new FormControl(null, [Validators.required]),
      RetailerCode: new FormControl({value:null, disabled:true}, Validators.required),
      Email: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      Mobile: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      CNIC: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.cnic_Pattern)]),
      Address: new FormControl(null, [Validators.required]),
      CreatedDate: new FormControl(null, [Validators.required]),
      CompanyName: new FormControl(null, [Validators.required]),
      
    });
     
      this.passwordFormGroup = new FormGroup ({
        Username: new FormControl(JSON.parse(localStorage.getItem('userIdentity')).UserAccount.Username,[Validators.required]),
        Password: new FormControl(null,[Validators.required,Validators.pattern(AppPattern.password)]),
        ConfirmPassword: new FormControl(null,[Validators.required,Validators.pattern(AppPattern.password)]),
        NewPassword: new FormControl(null,[Validators.required,Validators.pattern(AppPattern.password)]),

        
      })
    this.loadProfile();
  }

  loadProfile() {
    this._profileService.getById(JSON.parse(localStorage.getItem('userIdentity')).UserAccount.RetailerID, 1, "retailer/")
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
        this._toast.error(err.error.message,"Error")
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
        this._toast.error(err.error.message,"Error")
      }
    })
  }

}
