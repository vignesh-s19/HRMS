import { Component, Inject, OnInit,ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserInviteComponent } from '../user-invite/user-invite.component';
import { UserService } from '../shared/user.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { User } from '../shared/user.model';

import { DialogService } from '../shared/dialog.service';
import { UserViewComponent } from '../user-view/user-view.component';




@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  displayedColumns: string[] = ['select','email', 'role','status','lastActivity','Action'];
  dataSource: MatTableDataSource<User>;
  statusList:string[]=['Active','Deactive','Pending','Expired'];
  user:User=new User();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selection = new SelectionModel<User>(true, []);
  showEmail:boolean=false;
  constructor( private userService: UserService,
     public dialog:MatDialog,
     private dialogService:DialogService,
     ) { }


  ngOnInit(): void {
    this.getAlluser();
   
  }

  
  openDialog() {
    this.dialog.open(UserInviteComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='Invite'){
        this.getAlluser();
      }
    });
  }

  editUser(row:any) {

    this.dialog.open(UserInviteComponent, {
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAlluser();
      }
    });
    this.showEmail = true;
  }

  openProfile() {
    this.dialog.open(UserViewComponent, {
      width:'40%'
    });
  }


  getAlluser(){
    this.userService.getAll()
    .subscribe({
      next:(res: any)=>{
       this.dataSource=new MatTableDataSource(res);
       this.dataSource.paginator=this.paginator;
       this.dataSource.sort=this.sort;
      },
      error:(err)=>{
        alert("something went wrong");
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
}

// activateSelectedUsers() {
//   this.selection.selected.forEach( user => {

//     this.userService.activateUser(user,user.id).subscribe((_res: any)=>{
//       user.status="Active";
//       alert("Activated");
//       this.getAlluser();
//     });
  
//  });
 
// }

// deActivateSelectedUsers() {
//   this.selection.selected.forEach( user => {
//     this.userService.activateUser(user,user.id).subscribe((_res: any)=>{
//       user.status="Deactive";
//       alert("deactivated")
//       console.log(this.selection.selected);
//       this.getAlluser();
//     });
//  });
 
// }

// deActivateUsers(id:any){
//   this.userService.activateUser(user,id).subscribe((_res: any)=>{
//     this.user.status="Deactive";
//     alert("deactivated")
//     this.getAlluser();
//   });
// }

// pendingUsers(){
//   this.selection.selected.forEach( user => {

//     this.userService.activateUser(user,user.id).subscribe((_res: any)=>{
//       user.status="Pending";
//       console.log(this.selection.selected);
      
//       this.getAlluser();
//     });
  
//  });
// }

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
      console.log(this.selection.selected);
      
}

 deletePrompt(row){
  this.dialogService.confirmDialog({
    title:'Delete Confirmation!',
    message:`Are you sure to delete  `+row.email,
    confirmCaption: 'Yes',
        cancelCaption: 'No'
  }).afterClosed().subscribe(res=>{
    if(res){
      this.userService.deleteUser(row.id)
      .subscribe(data=>{
        this.getAlluser();
      }); 
    }
  });
 }
}


