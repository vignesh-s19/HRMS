import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Employee} from '../shared/employee.model';


@Component({
  selector: 'app-employee-basics-details',
  templateUrl: './employee-basics-details.component.html',
  styleUrls: ['./employee-basics-details.component.scss']
})
export class EmployeeBasicsDetailsComponent implements OnInit {
  @Input()
  employee: Employee;

  @Output()
  valueChange = new EventEmitter<Partial<Employee>>();

  @Output()
  formReady = new EventEmitter<FormGroup>();

  basicForm: FormGroup;

  private subscription = new Subscription();
  selectedFiles: any;
  aadharFiles: any;
  
  // get firstName() { return this.basicForm.get('firstName'); }
  // get lastName() { return this.basicForm.get('lastName'); }
  // get nameAadhar() { return this.basicForm.get('nameAadhar'); }
  // get AadharNo() { return this.basicForm.get('AadharNo'); }

  // get Fathername() { return this.basicForm.get('Fathername'); }
  // get birthday() { return this.basicForm.get('birthday'); }
  // get PANno() { return this.basicForm.get('PANno'); }

  
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    // this.basicForm = this.fb.group({
    //   firstName:  [this.employee.firstName, [Validators.required]],
    //   lastName: [this.employee.lastName, [Validators.required]],
    //   nameAadhar: [this.employee.nameAadhar, [Validators.required]],
    //   AadharNo: [this.employee.AadharNo, [Validators.required]],
    //   Fathername: [this.employee.Fathername, [Validators.required]],
    //   birthday: [this.employee.birthday, [Validators.required]],
    //   PANno: [this.employee.PANno, [Validators.required]],
    // }, { updateOn: 'submit' });

    this.basicForm = this.fb.group({
      firstName:  ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      nameAadhar: ['', [Validators.required]],
      AadharNo: ['', [Validators.required]],
      Fathername: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      PANno: ['', [Validators.required]],
    }, { updateOn: 'submit' });

this.basicForm.patchValue(this.employee);

    this.subscription.add(
      this.basicForm.valueChanges.subscribe((value) => {
        this.valueChange.emit({
          firstName: value.firstName,
          lastName: value.lastName,
          nameAadhar:  value.nameAadhar,
          Fathername: value.Fathername,
          birthday: value.birthday,
        });
      })
    );

    this.formReady.emit(this.basicForm);
  }

  ngOnDestroy(): void  {
    this.subscription.unsubscribe();
  }

  aadharFile(event: { target: { files: any; }; }): void  {
    this.aadharFiles = event.target.files;
  }
  
  selectFile(event: { target: { files: any; }; }): void  {
    this.selectedFiles = event.target.files;
  }
}
