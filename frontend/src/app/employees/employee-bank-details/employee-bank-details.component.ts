import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Employee } from '../shared/employee.model';

@Component({
  selector: 'app-employee-bank-details',
  templateUrl: './employee-bank-details.component.html',
  styleUrls: ['./employee-bank-details.component.scss']
})
export class EmployeeBankDetailsComponent implements OnInit {

  @Input()
  employee: Employee;

  bankForm: FormGroup;

  @Output()
  formReady = new EventEmitter<FormGroup>();

  @Output()
  valueChange = new EventEmitter<Partial<Employee>>();

  private subscription = new Subscription();
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.bankForm = this.fb.group({
      bankName: [this.employee.bankName, [Validators.required]],
      bankNo: [this.employee.bankNo, [Validators.required]],
      bankAddress: [this.employee.bankAddress, [Validators.required]],
    }, { updateOn: 'submit' });

    this.subscription.add(
      this.bankForm.valueChanges.subscribe((value) => {
        this.valueChange.emit({
          bankName: value.email,
        });
      })
    );

    this.formReady.emit(this.bankForm);
  }
  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }
}
