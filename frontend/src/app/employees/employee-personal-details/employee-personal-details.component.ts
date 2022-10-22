import { Component, OnInit,  ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import { FamilyDetailsV1, FamilyDetailsVM } from '../shared/familyDetails.model';
import { FamilyDetailsService } from '../shared/familyDetails.service';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-employee-personal-details',
  templateUrl: './employee-personal-details.component.html',
  styleUrls: ['./employee-personal-details.component.scss']
})
export class EmployeePersonalDetailsComponent implements OnInit {
  @ViewChild('familyForm', { static: false })
  familyForm: NgForm;

  familyData: FamilyDetailsV1 = new FamilyDetailsV1();
  relationshipDetails: FamilyDetailsVM[] = [];
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'name', 'relationship', 'dob', 'mobileNo', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  isEditMode = false;
  constructor(private familyDetailsService: FamilyDetailsService) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    
    this.getRelationshipname();
    // Fetch All Students on Page load
    this.getAll();
   
  }
  getAll() {
    this.familyDetailsService.getList().subscribe((response: any) => {
      this.dataSource.data = response;
    });
  }

  edit(element: any) {
    this.familyData = _.cloneDeep(element);
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.familyForm.resetForm();
  }

  delete(id: any) {
    this.familyDetailsService.deleteItem(id).subscribe((response: any) => {

      this.dataSource.data = this.dataSource.data.filter((o: FamilyDetailsV1) => {
        return o.id !== id ? o : false;
      })
      console.log(this.dataSource.data);
    });
  }
  add() {
    this.familyDetailsService.create(this.familyData).subscribe((response: any) => {
      this.dataSource.data.push({ ...response })
      this.dataSource.data = this.dataSource.data.map(o => {
        return o;
      })
    });
    this.familyForm.reset();
  }

  update() {
    this.familyDetailsService.update(this.familyData.id, this.familyData).subscribe((response: any) => {
      this.dataSource.data = this.dataSource.data.map((o: FamilyDetailsV1) => {
        if (o.id === response.id) {
          o = response;
        }
        return o;
      })
      this.cancelEdit()

    });
  }


  onSubmit() {
    if (this.familyForm.form.valid) {
      if (this.isEditMode)
        this.update()
      else
        this.add();
    } else {
      console.log('Enter valid data!');
    }
  }

  //get relationshipname
  getRelationshipname() {
    this.familyDetailsService.getRelationship().subscribe((response: any) => {
      this.relationshipDetails = response;
    });
  }
}
