import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Communication, Employee } from '../../shared/employee.model';
import { EmployeeService } from '../../shared/employee.service';


@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
  
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EmployeeDetailsComponent implements OnInit {
  employee : Employee;
  communication: Communication;
  basicForm : FormGroup =this._formBuilder.group({});
  communicationForm: FormGroup =this._formBuilder.group({});
  isLinear = true;
  isEditable = false;
  isSubmitted: boolean;
  public selectedIndex: number;

  constructor(private _formBuilder: FormBuilder, private employeeService: EmployeeService) { }

  PersonalForm : FormGroup =this._formBuilder.group({});
  
  thirdFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  ngOnInit(): void {
    this.employeeService.fetchEmployee().subscribe((employee) => {
      this.employee = employee;
    });
    this.employeeService.fetchCommunication().subscribe((communication) => {
      this.communication = communication;
    });
  }

  addbasicForm(name: string, group: FormGroup): void{
    this.basicForm.addControl(name, group);
  }

  addcommunicationForm(name: string, group: FormGroup): void{
    this.communicationForm.addControl(name, group);
  }

  onValueChange(changes: Partial<Employee>): void{
    this.employee = { ...this.employee, ...changes };
  }

  onValueChanges(changes: Partial<Communication>): void{
    this.communication = { ...this.communication, ...changes };
  }

  basicFormSubmit(): void{
    // this.isSubmitted = true;
    // if(!this.employeeForm.valid) {
    //   return;
    // }
    
    this.employeeService.saveEmployee(this.employee).subscribe(() => {
      this.basicForm.enable();
      // this.employeeForm.reset();
    });
  }
  communicationFormSubmit(): void{
    // this.isSubmitted = true;
    // if(!this.employeeForm.valid) {
    //   return;
    // }
    
    this.employeeService.saveCommunication(this.communication).subscribe(() => {
      this.communicationForm.enable();
      // this.employeeForm.reset();
    });
  }

  stepChange(event: { selectedIndex: number; }): void{
      this.selectedIndex= event.selectedIndex;
  }
}
