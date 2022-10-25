import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UserInviteComponent } from "../user-invite/user-invite.component";
import { UserService } from "../shared/user.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { User, UserStatus } from "../shared/user.model";

import { DialogService } from "../shared/dialog.service";
import { UserEditRoleComponent } from "../user-edit-role/user-edit-role.component";

@Component({
  selector: "app-user-table",
  templateUrl: "./user-table.component.html",
  styleUrls: ["./user-table.component.scss"],
})
export class UserTableComponent implements OnInit {
  displayedColumns: string[] = [
    "select",
    "email",
    "role",
    "status",
    "lastActivity",
    "Action",
  ];
  dataSource: MatTableDataSource<User>;
  statusList: string[] = ["Invited", "Active", "Deactivated", "Revoked"];
  user: User = new User();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selection = new SelectionModel<User>(true, []);

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadUserDataSource();
  }

  ngOnDestroy(): void {
    this.selection.changed.unsubscribe();
  }

  onInviteUser() {
    this.dialog
      .open(UserInviteComponent, {
        width: "40%",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result.event == "inviteUser") {
          result.data.users.forEach((user) => {
            this.dataSource.data.push(user);
          });
          //refresh
          this.dataSource.data = this.dataSource.data.map((o) => {
            return o;
          });
        }
      });
  }

  onEditUser(row: any) {
    this.dialog
      .open(UserEditRoleComponent, {
        width: "20%",
        data: row,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result.event == "editUserRole") {
          row.userRoles = result.data.userRoles;
        } else if (result === "save") {
          this.loadUserDataSource();
        }
      });
  }

  loadUserDataSource() {
    this.userService.getAll().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
    });
  }

  isActionSelected(action: string): boolean {
    return !this.selection.selected.some(
      (user: any) => user.userStatus === action
    );
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

  updateSelectedUsersStatus(fromStatus: string, toStatus:string) {
    this.selection.selected.filter((user)=> user.userStatus == fromStatus).forEach((user) => {

      let userStatus: UserStatus  =   {
         userId : user.userId,
         status : toStatus
      };

      this.userService
        .updateUserStatus(userStatus)
        .subscribe((_res: any) => {
          if (_res) {
            user.userStatus = toStatus;
          }
        });
    });
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
    console.log(this.selection.selected);
  }

  onDeleteUser(row: User) {
    this.dialogService
      .confirmDialog({
        title: "Delete Confirmation!",
        message: `Are you sure to delete  ` + row.email,
        confirmCaption: "Yes",
        cancelCaption: "No",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.userService.deleteUser(row.userId).subscribe((data) => {
            this.dataSource.data = this.dataSource.data.filter(
              (u) => u.userId !== row.userId
            );
          });
        }
      });
  }
}
