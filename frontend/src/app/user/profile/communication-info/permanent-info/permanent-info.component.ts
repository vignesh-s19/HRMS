import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PermanentAddress } from 'src/app/user/shared/user-profile.model';
import { UserProfileService } from 'src/app/user/shared/user-profile.service';


@Component({
  selector: 'permanent-info',
  templateUrl: './permanent-info.component.html',
  styleUrls: ['./permanent-info.component.scss']
})
export class PermanentInfoComponent implements OnInit {
  disableSelect = new FormControl(false);
  permanentForm: FormGroup;
  permanentInfo: PermanentAddress = {
    userAddressId: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    
  };
  // permanentInfo: PermanentAddress = new PermanentAddress();
  constructor(private fb: FormBuilder, private userProfileService: UserProfileService) { }
  ngOnInit(): void {
    this.permanentForm = this.fb.group({
      'street': new FormControl(''),
      'apartment': new FormControl(''),
      'city': new FormControl(''),
      'state': new FormControl(''),
      'pincode': new FormControl('')
    }, { updateOn: 'submit' });
  }
  onSubmit(){
    this.userProfileService.saveUserPermanentAddressInfo(this.permanentInfo);
  }
}
