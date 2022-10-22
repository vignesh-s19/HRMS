import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FamilyDetailsVM } from '../shared/add-edit.model';
import { FamilyDetails } from '../shared/add-edit.model';
import { FamilyDetailsColumns } from '../shared/add-edit.model';
import { AddEditService } from '../shared/add-edit.service';


@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  
  displayedColumns: string[] = FamilyDetailsColumns.map((col) => col.key);
  columnsSchema: any = FamilyDetailsColumns;
  dataSource = new MatTableDataSource<FamilyDetails>();
  valid: any = {};
  constructor(private addEditService: AddEditService) { }

  ngOnInit(): void {
    this.getAll();
   
  }

  getAll(){
    this.addEditService.getAll().subscribe((res: any) => {
      this.dataSource.data = res;
    });
  }

  editRow(row: FamilyDetailsVM) {
    if (row.id === '') {
      this.addEditService.add(row).subscribe((newFamilyDetail: FamilyDetailsVM) => {
        row.id = newFamilyDetail.id;
        row.isEdit = false;
      });
    } else {
      this.addEditService.update(row).subscribe(() => (row.isEdit = false));
    }
  }

  addRow() {
    const newRow: FamilyDetailsVM = {
      id: '',
      name: '',
      relationship: '',
      birthDate: '',
      isEdit: true,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  removeRow(id: any) {
    this.addEditService.delete(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(
        (u: FamilyDetails) => u.id !== id
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