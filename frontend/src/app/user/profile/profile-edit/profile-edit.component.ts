import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });


  
  basicInfoFormGroup: FormGroup;
  aadharFile: File;
  PANFile: File;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.basicInfoFormGroup = this._formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      nameAadhar: ['', [Validators.required]],
      AadharNo: ['', [Validators.required]],
      Fathername: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      PANno: ['', [Validators.required]],
    }, { updateOn: 'submit' });
  }

  onSelectAadharFile(event: Event ): void  {
    this.aadharFile = this.getInputFile(event);
  }

  onSelectPANFile(event: Event ): void  {
    this.PANFile = this.getInputFile(event);
  }
  
  getInputFile(event: Event ): File  {
    const element = event.currentTarget /* event.target */ as HTMLInputElement;
    let file: File | null = element.files[0];
    return file;
  }

 
}
