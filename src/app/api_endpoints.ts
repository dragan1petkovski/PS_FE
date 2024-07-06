//export const session_id ="120B130E-CB91-480B-9C63-F9DF765CE3E0"

export const session_id ="00B9F0F9-7B89-40A4-9CEA-29C0F6396ECA" //user1
export const admin_session_id = ''

export class api_endpoints
{
    // Regular User API endpoints
    static readonly GetClientsByTypeUserId ="api/client/GetClientsByTypeUserId/"

    static readonly getCredentialsByClientID ="api/Credential/GetCredentialByClientID/"
    static readonly setCredentials = "api/Credential/SetCredential/"
    static readonly deleteCredential = "api/Credential/DeleteCredential/"

    static readonly GetCredentialPasswordById = "api/Password/GetCredentialPasswordById/"
    static readonly GetCertificatePasswordById = "api/Password/GetCertificatePasswordById/"

    static readonly getAllClientTeamMappingsByUserId = "api/Team/GetAllClientTeamMappingsByUserId/"
    static readonly getAllClientTeamMappings = "api/Team/GetAllClientTeamMappings/"

    static readonly getCertificateByClientID = "api/Certificate/GetCertificateByClientID/"

    static readonly getPersonalCredentialsFoldersByUserID ="api/Personal/GetCredentialsFoldersByUserID/"
    static readonly getPersonalCredentialsFolderByFolderID ="api/Personal/GetCredentialsByFoderID/"

    static readonly setPersonalFolderByUserID="api/Personal/AddFolderByUserId/"
    static readonly setPersonalCredentialByUserID="api/Personal/AddCredentialByUserId/"

    // Administrator API endpoints
    static readonly GetAllFullClients ="api/client/GetAllFullClients"
    static readonly GetAllPartClients ="api/client/GetAllPartClients"

    static readonly GetAllFullUsers = "api/user/GetAllFullUsers"
    static readonly GetAllPartUsers = "api/user/GetAllPartUsers"

    static readonly getAllTeams = "api/team/GetAllTeams"

    static readonly AddClient = "api/client/AddClient"
    static readonly AddTeam = "api/team/AddTeam"
    static readonly AddUser = "api/user/AddUser"

}



