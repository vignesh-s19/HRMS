import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '../shared/dialog.service';
import { UserService } from '../shared/user.service';
import { InviteUser, User } from '../shared/user.model';

@Component({
  selector: 'app-user-invite',
  templateUrl: './user-invite.component.html',
  styleUrls: ['./user-invite.component.scss']
})
export class UserInviteComponent implements OnInit {

  userForm!:FormGroup;
  public seperatorKeysCodes:number[]=[ENTER, COMMA];
  public emailList=[];
  removable=true;
  actionBtn:string="Invite";
  showEmail:boolean=false;
  formTitle:string="Invite users:";

  constructor(
    private formBuilder:FormBuilder,
    private userService:UserService, 
    private dialogRef:MatDialogRef<UserInviteComponent>,
    @Inject(MAT_DIALOG_DATA)
    public editData:any,
    private dialogService:DialogService) { }

  paste(event: ClipboardEvent): void {
       event.preventDefault();
       event.clipboardData
            .getData('Text')
            .split(/;|,|\n/)
            .forEach(value => {
              if(value.trim()){
                

                //check duplication warning message 
//if email exsit raise error and remove from list


                this.emailList.push({ 
                    value: value.trim() 
                  });
                return;
              }
            });
    }

  add(event): void {
        console.log(event.value);
        if (event.value) {
            if (this.validateEmail(event.value)) {

              if(event.value )
                this.emailList.push({ value: event.value, invalid: false });
            }
            else {
                this.emailList.push({ value: event.value, invalid: true });
            }
        }
        if (event.input) {
            event.input.value = '';
        }
    }

  removeEmail(data: any): void {
        console.log('Removing ' + data)
        if (this.emailList.indexOf(data) >= 0) {
            this.emailList.splice(this.emailList.indexOf(data), 1);
        }
   }


  ngOnInit(): void {
    this.userForm=this.formBuilder.group({
      email:[''],
      role:[''],
      docs:[''],
      requestProfile:[''],
      empForm:[''],
      status:[''],
    });
    if(this.editData){
          this.formTitle="update user:"
          this.showEmail=true;
          this.actionBtn="save";
          this.userForm.controls['email'].setValue(this.editData.email);
          this.userForm.controls['role'].setValue(this.editData.role);
          this.userForm.controls['docs'].setValue(this.editData.docs);
          this.userForm.controls['empForm'].setValue(this.editData.empForm);
          this.userForm.controls['status'].setValue(this.editData.status);
          this.userForm.controls['requestProfile'].setValue(this.editData.profileStatus);

      }  
  }

  invite(): void{
    this.showEmail=true;
    if(!this.editData){
      if(this.userForm.valid){

this.emailList.forEach((email)=>{

  let user: InviteUser= {
    email: email,  
  userRole: this.editData.role,
  requestProfile:this.editData.requestProfile
  };

  this.userService.inviteUser(user)
  .subscribe({
    next:(res)=>{
      this.dialogService.confirmUpdate({
        title:'Invitation Confirmation!',
        message:`${user.email} invited successfully `,
        confirmCaption: 'okay',
        cancelCaption:''
      })
      console.log(this.userForm.value);
      this.userForm.reset(); 
      this.dialogRef.close();
    },
    error:()=>{
      alert("something went wrong");
    }
  })

});

       
      }
    }
    else{
      this.updateUser();
    } 
  } 

  updateUser(): void{
    this.userService.updateUser(this.userForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        this.dialogService.confirmUpdate({
          title:'Update Confirmation!',
          message:`You have updated successfully `,
          confirmCaption: 'okay',
          cancelCaption:''
        })
        this.userForm.reset();
        this.dialogRef.close('save');
      },
      error:()=>{
        alert("Something went wrong");
      }
    })
  }

  private validateArrayNotEmpty(c: FormControl) {
    if (c.value && c.value.length === 0) {
      return {
        validateArrayNotEmpty: { valid: false }
      };
    }
    return null;
  }

  private validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


}
