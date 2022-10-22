import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReferenceDetails, ReferenceDetailsColumns, ReferenceDetailsVM  } from '../shared/shared/reference.model';
import { AddEditService } from '../shared/shared/add-edit.service'; 



@Component({
  selector: 'app-employee-reference-details',
  templateUrl: './employee-reference-details.component.html',
  styleUrls: ['./employee-reference-details.component.scss']
})
export class EmployeeReferenceDetailsComponent implements OnInit {
  displayedColumns: string[] = ReferenceDetailsColumns.map((col) => col.key);
  columnsSchema: any = ReferenceDetailsColumns;
  dataSource = new MatTableDataSource<ReferenceDetails>();
  valid: any = {};
  constructor(private addEditService: AddEditService) { }

  ngOnInit(): void {
    this.getAll();
   
  }

  getAll(){
    this.addEditService.getAllReference().subscribe((res: any) => {
      this.dataSource.data = res;
    });
  }

  editRow(row: ReferenceDetailsVM) {
    if (row.id === '') {
      this.addEditService.addReference(row).subscribe((newReferenceDetail: ReferenceDetailsVM) => {
        row.id = newReferenceDetail.id;
        row.isEdit = false;
      });
    } else {
      this.addEditService.updateReference(row).subscribe(() => (row.isEdit = false));
    }
  }

  addRow() {
    const newRow: ReferenceDetailsVM = {
      id: '',
      name: '',
      mobileNo: '',
      relationship: '',
      isEdit: true,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  removeRow(id: any) {
    this.addEditService.deleteReference(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(
        (u: ReferenceDetails) => u.id !== id
      );
    });
  }
  
  inputHandler(e: any, id: number, key: string) {
    if (!this.valid[id]) {
      this.valid[id] = {};
    }
    this.valid[id][key] = e.target.validity.valid;
  }

  disableSubmit(id: number) {
    if (this.valid[id]) {
      return Object.values(this.valid[id]).some((item) => item === false);
    }
    return false;
  }
  
}
