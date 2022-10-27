import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UserService } from "../shared/user.service";

@Component({
  selector: "app-user-edit-role",
  templateUrl: "./user-edit-role.component.html",
})
export class UserEditRoleComponent implements OnInit {
  editUserRoleForm!: FormGroup;
  userRoleList: string[] = ["admin", "user"];
  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _dialogRef: MatDialogRef<UserEditRoleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public userData: any
  ) {}

  ngOnInit(): void {
    this.editUserRoleForm = this._formBuilder.group({
      userRoles: ["", [Validators.required]],
    });

    if (this.userData) {
      this.editUserRoleForm.patchValue(this.userData);
    }
  }

  onUpdateRole(): void {
    var userRoles = this.editUserRoleForm.get("userRoles").value;

    if (userRoles.length == 0) {
      alert("Please select at least one user role");
      return;
    }
    this._userService
      .updateUserRoles(userRoles, this.userData.userId)
      .subscribe({
        next: (res) => {
          this.editUserRoleForm.reset();
          this._dialogRef.close({
            event: "editUserRole",
            data: { userRoles: userRoles },
          });
        },
      });
  }
}
