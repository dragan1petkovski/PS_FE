import { Component, Output, EventEmitter } from '@angular/core';
import { navMenuBody } from './navMenuBody/navMenuBody.component';
import { navMenuHeader } from './navMenuHeader/navMenuHeader.component';
import { WorkAreaBody } from './workAreaBody/workAreaBody.component';
import { WorkAreaHeader } from './workAreaHeader/workAreaHeader.component';
import { ConnectionService } from '../utility/connection.service'

import { iClientOrganization } from '../interfaces/clientOrganization';
import { iCredential } from '../interfaces/credential';
import { iSelectTabTabs } from '../interfaces/relationshipInterfaces/SelectNavTabs';
import { iCertificate } from '../interfaces/certificate';
import { api_endpoints } from '../api_endpoints'
import { session_id } from '../api_endpoints';
import { iPersonalFolder } from '../interfaces/PersonalFolder';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './homepage.component.html',
  imports: [navMenuBody,navMenuHeader,WorkAreaBody,WorkAreaHeader],
  providers: [ConnectionService]

})
export class HomepageComponent {
  title = 'Password Sense';
  navMenuBodyItems:any;
  workAreaBodyItems:any = [];
  credentialsURL: string = ""
  selectTab: iSelectTabTabs = {credentialsTab:false, certificatesTab: false, privateTab: false}


  constructor(private connectionService: ConnectionService) {
  }

  async ngOnInit()
  {
    let body = document.getElementById("body")
    if(body?.getAttribute("style") == null)
      {
        body?.setAttribute("style","background-image: url('/assets/Background.png'); opacity: 0.9;")
      }
    this.selectTab = {credentialsTab:true, certificatesTab: false, privateTab: false}
    await this.GetTabInformation(this.selectTab)
  }

  async GetCompanyInformation(url: string)
  {
    if (this.selectTab.certificatesTab)
      {
        this.workAreaBodyItems = await this.GetCompanyCertificates(url)
      }
    else if (this.selectTab.credentialsTab)
      {
        this.workAreaBodyItems = await this.GetCompanyCredentials(url)
      }
    else if (this.selectTab.privateTab)
      {
        this.workAreaBodyItems = await this.GetCompanyCredentials(url)
      }
  }

  async GetCompanyCredentials(url: string)
  {``
    let json = await this.connectionService.getItems(url)
    let jsonData = json as iCredential[]
    return jsonData
    
  }

  async GetCompanyCertificates(url: string)
  {
    let json = await this.connectionService.getItems(url)
    let jsonData = json as iCertificate[]
    console.log(jsonData)
    return jsonData
  }


  async GetTabInformation(temp: iSelectTabTabs)
  {
    this.selectTab = temp
    if (this.selectTab.certificatesTab)
      {
        this.navMenuBodyItems = await this.GetCertificateTabCompanies(api_endpoints.GetClientsByTypeUserId.concat("cert","/",session_id))
        this.workAreaBodyItems = await this.GetCompanyCertificates(this.navMenuBodyItems[0].certificateURL)
      }
    else if (this.selectTab.credentialsTab)
      {
        this.navMenuBodyItems = await this.GetCredentialsTabCompanies(api_endpoints.GetClientsByTypeUserId.concat("cred","/",session_id))
        this.workAreaBodyItems = await this.GetCompanyCredentials(this.navMenuBodyItems[0].credentialURL)
      }
    else if (this.selectTab.privateTab)
      {
        this.navMenuBodyItems = await this.GetPersonalTabFoders(api_endpoints.getPersonalCredentialsFoldersByUserID.concat(session_id))
        console.log(this.navMenuBodyItems)
        this.workAreaBodyItems = await this.GetPersoanlCredentials(api_endpoints.getPersonalCredentialsFolderByFolderID.concat(session_id,'/',this.navMenuBodyItems[0].id))
      }
  }

  async GetPersonalTabFoders(url: string)
  {
    let json = await this.connectionService.getItems(url)
    let jsonData = json as iPersonalFolder[]
    return jsonData
  }
  async GetPersoanlCredentials(url: string)
  {
    let json = await this.connectionService.getItems(url)
    let jsonData = json as iClientOrganization[]
    return jsonData

  }

  async GetCredentialsTabCompanies(url: string)
  {
    let json = await this.connectionService.getItems(url)
    let jsonData = json as iClientOrganization[]
    for(let client of jsonData)
    {
      client.credentialURL = api_endpoints.getCredentialsByClientID.concat(session_id,"/",client.id)
    }
    return jsonData

  }

  async GetCertificateTabCompanies(url: string)
  {
    let json = await this.connectionService.getItems(url)
    let jsonData = json as iClientOrganization[]
    for(let client of jsonData)
    {
      client.certificateURL = api_endpoints.getCertificateByClientID.concat(session_id,'/',client.id)
    }
    return jsonData

  }

}
