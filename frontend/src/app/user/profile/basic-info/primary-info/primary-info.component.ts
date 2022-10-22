import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserProfileService } from '../../../shared/user-profile.service';
import { GuardianType, UserBasicInfo, UserProfile } from '../../../shared/user-profile.model'; 

@Component({
  selector: 'primary-info',
  templateUrl: './primary-info.component.html',
})
export class PrimaryInfoComponent implements OnInit {
  basicInfo: UserBasicInfo = new UserBasicInfo();
  //@Input()
  guardianTypes: (string | GuardianType)[];
  GuardianType: GuardianType;
  basicInfoFormGroup: FormGroup;
  aadhaarFile: File;
  PANFile: File;
  PassportFile: File;


  constructor(private _formBuilder: FormBuilder, private userProfileService: UserProfileService) { }

  ngOnInit(): void {
    this.guardianTypes = Object.values(GuardianType).filter(value => typeof value === 'string');
    this.basicInfoFormGroup = this._formBuilder.group({
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      profileImageFile: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      aadhaarName: ['', [Validators.required]],
      aadhaarNumber: [''],
      aadhaarFile:[''],
      panNumber: [''],
      panFile:[''],
      nationality:[''],
      passportNumber:[''],
      validVisaInformation:[''],
      guardianType: ['', [Validators.required]],
      guardianName: ['', [Validators.required]],
    }, { updateOn: 'submit' });


    //basicinfo read as input from component
    this.basicInfoFormGroup.patchValue(this.basicInfo);
  }

  onSelectAadhaarFile(event: Event): void {
    this.aadhaarFile = this.getInputFile(event);
  }

  onSelectPANFile(event: Event): void {
    this.PANFile = this.getInputFile(event);
  }
  
  onSelectPassportFile(event: Event){
    this.PassportFile = this.getInputFile(event);
  }

  getInputFile(event: Event): File {
    const element = event.currentTarget /* event.target */ as HTMLInputElement;
    let file: File | null = element.files[0];
    return file;
  }

  onSubmit(): void {
    this.userProfileService.saveUserBasicInfo(this.basicInfo);
  }
}
