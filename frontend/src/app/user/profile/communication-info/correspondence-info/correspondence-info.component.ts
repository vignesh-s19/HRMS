import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, PatternValidator } from '@angular/forms';
import { Communication } from 'src/app/employees/shared/employee.model';
import { CorrespondenceAddress } from 'src/app/user/shared/user-profile.model';
import { UserProfileService } from 'src/app/user/shared/user-profile.service';

@Component({
  selector: 'correspondence-info',
  templateUrl: './correspondence-info.component.html',
  styleUrls: ['./correspondence-info.component.scss']
})
export class CorrespondenceInfoComponent implements OnInit {

  // correspondenceInfo: CorrespondenceAddress = new CorrespondenceAddress();

  correspondenceInfo: CorrespondenceAddress = {
    userAddressId: "",
    homePhone: "",
    mobilePhone: "",
    email: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    pincode: ""
  };
  @Input()
  communication: Communication;

  @Output()
  formReady = new EventEmitter<FormGroup>();


  correspondenceForm: FormGroup;

  constructor(private fb: FormBuilder, private userProfileService: UserProfileService) { }

  ngOnInit(): void {
    this.correspondenceForm = this.fb.group({
      'email': new FormControl('', Validators.required, PatternValidator['^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$']),
      'mobilePhone':new FormControl('', Validators.required),
      'homePhone': new FormControl(''),
      'street':new FormControl('', Validators.required),
      'apartment':new FormControl('', Validators.required),
      'city': new FormControl('', Validators.required),
      'state': new FormControl('', Validators.required),
      'pincode': new FormControl('', Validators.required),

      //   'email': this.fb.control('', [Validators.required, Validators.email,
      //   Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$') ]),
      // 'mobilePhone': this.fb.control('', Validators.required),
      // 'homePhone':this.fb.control(''),
      // 'street': this.fb.control('', Validators.required),
      // 'apartment': this.fb.control('', Validators.required),
      // 'city': this.fb.control('', Validators.required),
      // 'state': this.fb.control('', Validators.required),
      // 'pincode': this.fb.control('', Validators.required),

      // email: [this.communication.email, [Validators.required, Validators.email,
      // Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      // mobilePhone: [this.communication.mobilePhone, [Validators.required]],
      // homePhone: [''],
      // street: ['', [Validators.required]],
      // apartment: ['', [Validators.required]],
      // city: ['', [Validators.required]],
      // state: ['', [Validators.required]],
      // pincode: ['', [Validators.required]],
    }, { updateOn: 'submit' });

    this.formReady.emit(this.correspondenceForm);
  }

  onSubmit(): void {
    this.userProfileService.saveUserCorrespondenceAddressInfo(this.correspondenceInfo);
  }
}
