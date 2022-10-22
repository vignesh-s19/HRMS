import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';
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
  selector: 'app-employee-spouse-details',
  templateUrl: './employee-spouse-details.component.html',
  styleUrls: ['./employee-spouse-details.component.scss']
})
export class EmployeeSpouseDetailsComponent implements OnInit {
  matcher = new MyErrorStateMatcher();

  @Input()
  employee: Employee;

  spouseForm: FormGroup;

  @Output()
  formReady = new EventEmitter<FormGroup>();

  @Output()
  valueChange = new EventEmitter<Partial<Employee>>();

  private subscription = new Subscription();
 
  get spouseName() { return this.spouseForm.get('spouseName'); }
  get spouseEmployer() { return this.spouseForm.get('spouseEmployer'); }
  get spousePhone() { return this.spouseForm.get('spousePhone'); }
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.spouseForm = this.fb.group({
      spouseName: [this.employee.spouseName, [Validators.required]],
      spouseEmployer: [this.employee.spouseEmployer, [Validators.required]],
      spousePhone: [this.employee.spouseEmployer, [Validators.required]],
    
    }, { updateOn: 'submit' });
    
    this.subscription.add(
      this.spouseForm.valueChanges.subscribe((value) => {
        this.valueChange.emit({
          spouseName: value.email,
        });
      })
    );

    this.formReady.emit(this.spouseForm);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
