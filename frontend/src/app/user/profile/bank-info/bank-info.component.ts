import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankInfo } from '../../shared/bank.model';

@Component({
  selector: 'bank-info',
  templateUrl: './bank-info.component.html',
  styleUrls: ['./bank-info.component.scss']
})
export class BankInfoComponent implements OnInit {
  bankInfoFormGroup: FormGroup;
  bankInfo: BankInfo = new BankInfo();
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.bankInfoFormGroup = this._formBuilder.group({
      bankName: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      ifscCode: ['', [Validators.required]],
      nameInBank:['', [Validators.required]],
  })
}

onSubmit(){

}
}
