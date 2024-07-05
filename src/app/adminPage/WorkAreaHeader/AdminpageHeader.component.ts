import { Component,Input } from "@angular/core";
import { GeneratePassword } from '../../passwordGenerator/passwordGenerator';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { iSelectTabTabs } from "../../interfaces/relationshipInterfaces/SelectNavTabs";

@Component({
    selector: 'AdminpageHeader',
    templateUrl: './AdminpageHeader.component.html',
    standalone: true,
    imports: [ReactiveFormsModule]
    
})
export class AdminpageHeader { 
    @Input() selectTab: iSelectTabTabs = {credentialsTab: true, certificatesTab: false, privateTab: false}
}