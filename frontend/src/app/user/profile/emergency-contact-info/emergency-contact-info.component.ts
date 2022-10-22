import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmergencyContactInfo } from '../../shared/emergency-contact.model';

@Component({
  selector: 'emergency-contact-info',
  templateUrl: './emergency-contact-info.component.html',
  styleUrls: ['./emergency-contact-info.component.scss']
})
export class EmergencyContactInfoComponent implements OnInit {
  emergencyInfoFormGroup: FormGroup;
  emergencyInfo: EmergencyContactInfo = new EmergencyContactInfo();
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.emergencyInfoFormGroup = this._formBuilder.group({
      physician: [''],
      phoneNumber: [''],
      bloodGroup: [''],
      firstName: [''],
      lastName: [''],
      relationship: [''],
      street: [''],
      city: [''],
      state: [''],
      pincode: [''],
      homePhone: [''],
      workPhone: [''],
      mobilePhone: [''],
    })
  }
  onSubmit() {

  }
}
