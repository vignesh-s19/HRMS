export class Employee {
    firstName: string;
    lastName: string;
    nameAadhar: string;
    AadharNo:string;
    Fathername: string;
    birthday: string;
    PANno:string;
    spouseName : string;
    spouseEmployer : string;
    spousePhone : string;
    bankName : string;
    bankNo : string;
    bankAddress : string;
    dependents : string;
    nominee : string;
    maritialStatus:boolean;
  }

  export class Employeepersonal extends Employee{
    initial: string;
    firstName : string;
    lastName: string;
    fatherName:string;
    motherName: string;
    fatherDOB: string;
    motherDOB: string;
  }

  export class Communication {
    streetAddress : string;
    apartmentUnit : string;
    city : string;
    state : string;
    pincode : string;
    email:  string;
    mobilePhone: string;
  }