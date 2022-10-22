import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { Employee } from '../shared/employee.model';

/** Error when invalid control is dirty, touched, or submitted. */
class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || isSubmitted) //|| control.touched 
    );
  }
}

@Component({
  selector: 'app-employee-nominee-details',
  templateUrl: './employee-nominee-details.component.html',
  styleUrls: ['./employee-nominee-details.component.scss']
})
export class EmployeeNomineeDetailsComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  @Input()
  employee: Employee;

  nomineeForm: FormGroup;

  @Output()
  formReady = new EventEmitter<FormGroup>();

  @Output()
  valueChange = new EventEmitter<Partial<Employee>>();

  private subscription = new Subscription();
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.nomineeForm = this.fb.group({
      dependents: [this.employee.dependents, [Validators.required]],
      nominee: [this.employee.nominee, [Validators.required]],
    }, { updateOn: 'submit' }); 

    this.subscription.add(
      this.nomineeForm.valueChanges.subscribe((value) => {
        this.valueChange.emit({
          dependents: value.email,
        });
      })
    );

    this.formReady.emit(this.nomineeForm);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
