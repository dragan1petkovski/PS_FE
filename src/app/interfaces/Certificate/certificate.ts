export interface iGetCertificate
{
    id: string,
    name: string,
    friendlyname: string,
    issuedby: string,
    issuedto: string,
    expirationdate: string,
    teamname: string,
    teamid: string,
    clientid: string,
    pem: boolean

}

export interface iDeleteCertificate
{
    teamid: string,
    id: string
}

export interface DownloadCertificate
{
    certificateId: string,
    teamId: string
}