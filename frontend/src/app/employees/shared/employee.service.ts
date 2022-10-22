import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Employee } from './employee.model';
import { Communication } from './employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  constructor() {}
  fetchCommunication(): Observable<Communication> {
  //    const communication: Communication = {
  //     streetAddress : '',
  //     apartmentUnit : '',
  //     city : '',
  //     state :'',
  //     pincode : '' ,
  //     email: '',
  //     mobilePhone:'',
  // };
    const communication: Communication = {
    streetAddress : '213,abc',
    apartmentUnit : '12',
    city : 'new york',
    state :'new york',
    pincode : '45467' ,
    email: 'mark@gmail.com',
    mobilePhone:'9876767809',
    };
    return of(communication).pipe(delay(1000));
  }
  fetchEmployee(): Observable<Employee> {
   
    // const employee: Employee = {
    //   firstName: '',
    //   lastName: '',
    //   nameAadhar: '',
    //   Fathername: '',
    //   bithday: '',
    //   streetAddress : '',
    //   apartmentUnit : '',
    //   city : '',
    //   state :'',
    //   pincode : '' ,
    //   email: '',
    //   mobilePhone:'',
    //   spouseName : '',
    //   spouseEmployer : '',
    //   spousePhone : '',
    //   bankName : '',
    //   bankNo : '',
    //   bankAddress :'',
    //   dependents : '',
    //   nominee : '',
    //   maritialStatus:false
    //   };
      const employee: Employee = {
    firstName: 'John',
    lastName: 'Doe',
    nameAadhar: 'John Doe',
    AadharNo:'123456789123',
    Fathername: 'mark',
    birthday: '10/03/2022',
    PANno: '43654365436',
    // streetAddress : '213,abc',
    // apartmentUnit : '12',
    // city : 'new york',
    // state :'new york',
    // pincode : '45467' ,
    // email: 'mark@gmail.com',
    // mobilePhone:'9876767809',
    spouseName : 'string',
    spouseEmployer : 'string',
    spousePhone : '1324324',
    bankName : 'abc Bank',
    bankNo : '12345678',
    bankAddress :'123, xyz',
    dependents : 'string',
    nominee : 'nl',
    maritialStatus:false
    };

    return of(employee).pipe(delay(1000));
  }

  saveCommunication(communication: Communication): Observable<Communication> {
    console.log('Saving communication...', communication);
    return of(communication).pipe(delay(1000));
  }

  saveEmployee(employee: Employee): Observable<Employee> {
    console.log('Saving employee...', employee);
    return of(employee).pipe(delay(1000));
  }
}
