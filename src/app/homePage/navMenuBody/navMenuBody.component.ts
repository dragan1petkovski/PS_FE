import { Component,Output,Input, EventEmitter } from "@angular/core";
import { NgFor,NgIf } from "@angular/common";
import { iClientOrganization } from "../../interfaces/clientOrganization";
import { iCertificate } from "../../interfaces/certificate";
import { iSelectTabTabs } from "../../interfaces/relationshipInterfaces/SelectNavTabs";
import { api_endpoints, session_id } from "../../api_endpoints";

@Component({
    selector: 'navMenuBody',
    templateUrl: './navMenuBody.component.html',
    standalone: true,
    imports: [NgFor, NgIf],
    providers:[api_endpoints]
    
})
export class navMenuBody {
    @Input() companyItems:any
    @Input() certItems:iCertificate[] = []
    @Input() selectTab: iSelectTabTabs = {credentialsTab: true, certificatesTab: false, privateTab: false}
    @Output() CompanyURL = new EventEmitter<string>()
    ChnageCredentialList(url: string,id: string)
    {
        this.ActiveBtn(id)
        this.CompanyURL.emit(url)
        
    }

    ChnagePersonalCredentialList(baseurl: string, userid: string, folderid: string)
    {
        console.log(`${userid} : ${folderid}`)
        let url = baseurl+userid+"/"+folderid
        this.ActiveBtn(folderid)
        this.CompanyURL.emit(url)
    }

    Link_getPersonalCredentialsByFolderid()
    {
        return api_endpoints.getPersonalCredentialsFolderByFolderID
    }

    GetSessionID()
    {
        return session_id
    }

    ActiveBtn(id: string)
    {
        let companies = document.getElementsByClassName('navbodybtns') as HTMLCollectionOf<HTMLButtonElement>
        for(let temp of companies)
        {
            let company = temp as HTMLButtonElement
            $(`#${company.id}`).removeClass('active')
        }
        $(`#${id}`).addClass('active')
    }
}
