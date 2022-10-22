import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule, MatOptionModule  } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatTreeModule} from '@angular/material/tree'


import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { PrimaryInfoComponent } from './basic-info/primary-info/primary-info.component';
import { BankInfoComponent } from './bank-info/bank-info.component';
import { DependentInfoComponent } from './dependent-info/dependent-info.component';
import { EducationInfoComponent } from './education-info/education-info.component';
import { EmergencyContactInfoComponent } from './emergency-contact-info/emergency-contact-info.component';
import { JobHistoryInfoComponent } from './job-history-info/job-history-info.component';
import { NomineeInfoComponent } from './nominee-info/nominee-info.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { SpouseInfoComponent } from './spouse-info/spouse-info.component';
import { ReferenceInfoComponent } from './reference-info/reference-info.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { ImageInfoComponent } from './basic-info/image-info/image-info.component';
import { CorrespondenceInfoComponent } from './communication-info/correspondence-info/correspondence-info.component';
import { PermanentInfoComponent } from './communication-info/permanent-info/permanent-info.component';

@NgModule({
  declarations: [
    ProfileEditComponent,
    PrimaryInfoComponent,
    BankInfoComponent,
    DependentInfoComponent,
    EducationInfoComponent,
    EmergencyContactInfoComponent,
    JobHistoryInfoComponent,
    NomineeInfoComponent,
    PersonalInfoComponent,
    SpouseInfoComponent,
    ReferenceInfoComponent,
    ProfileViewComponent,
    ImageInfoComponent,
    CorrespondenceInfoComponent,
    PermanentInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatStepperModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatSliderModule,
    MatSnackBarModule,
    MatIconModule,
    MatExpansionModule,
    MatChipsModule,
    MatBottomSheetModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTableModule,
    MatGridListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatSelectModule,
    MatListModule,
    MatToolbarModule,
    MatSortModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    ScrollingModule,
    MatTreeModule,
    MatOptionModule,
  ]
})
export class ProfileModule { }
