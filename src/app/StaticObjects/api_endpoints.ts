export class api_endpoints
{
    //User API endpoints
    static readonly user = "api/user"
    static readonly changePassword = "api/user/changepassword"
    static readonly verificationcode = "api/user/verificationcode"
    static readonly resetPassword = "api/user/ResetPassword/"

    //Team API endpoints
    static readonly team = "api/team/"
    static readonly getteammapping = "api/team/mapping/"


    //Personal API endpoints
    static readonly personalfolder = "api/personalfolder/"

    //Password API endpoints
    static readonly getcertificatepassword = "api/password/certificate/"
    static readonly getcredentialpassword = "api/password/credential/"
    static readonly getpersonalpassword = "api/password/personal/"

    //Login API endpoints
    static readonly signin = "api/Login"

    //EmailNotification 
    static readonly setnewpassword = "user/SetNewPassword/"
    static readonly deleteverificateionrequest = "api/deleterequest"

    //Credential API endpoints
    static readonly credential = "api/credential/"
    static readonly personalcredential = "api/credential/personal"
    static readonly givecredential = "api/credential/givecredential/"

    //Certificate API endpoints
    static readonly certificate = "api/certificate/"
    static readonly certificatedownload = "api/certificate/download/"
    static readonly certificatekeydownload = "api/certificate/key/download/"

    //Client API endpoints
    static readonly client = "api/client/"
    static readonly clientcredential = "api/client/credential/"
    static readonly clientcertificate = "api/client/certificate/"
    static readonly fullclient = "api/client/full/"
    static readonly partclient = "api/client/part/"
}



