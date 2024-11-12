
export class StatusMessages
{
    private _statusCode: number
    private _message: string

    
    constructor( message: string,statusCode:number)
    {
        this._statusCode = statusCode
        this._message = message
    }

    public GetCode()
    {
        return this._statusCode
    }

    public GetMessage()
    {
        return this._message
    }

 
    public static readonly UnableToService:StatusMessages = new StatusMessages("Services is experiencing difficulties, please try again later",503);
    public static readonly AccessDenied:StatusMessages = new StatusMessages("Access Denied", 403);
    public static readonly UnauthorizedAccess:StatusMessages = new StatusMessages("Unauthorized Access Denied", 401);
    public static readonly ResourceNotFound:StatusMessages = new StatusMessages("Resource Not Found", 404);
    public static readonly Ok:StatusMessages = new StatusMessages("OK", 200)
    public static readonly UserExist:StatusMessages = new StatusMessages("User is already created with that e-mail address", 409);
    public static readonly UserNotexist:StatusMessages = new StatusMessages("User does not exist", 404);
    public static readonly AddNewUser:StatusMessages = new StatusMessages("New User successfull added", 201);
    public static readonly UpdateUser:StatusMessages = new StatusMessages("User is successfully updated", 200);
    public static readonly FailedToAddUser:StatusMessages = new StatusMessages("Failed to add New User", 503);
    public static readonly FailedtoUpdateUser:StatusMessages = new StatusMessages("Failed to update the User", 503);
    public static readonly FailedtoDeleteUser:StatusMessages = new StatusMessages("Failed to delete the User", 503);
    public static readonly DeleteUser:StatusMessages = new StatusMessages("User is successfully deleted", 204)
    public static readonly TeamNotexist:StatusMessages = new StatusMessages("Team does not exist", 404);
    public static readonly AddNewTeam:StatusMessages = new StatusMessages("New Team successfull added", 201);
    public static readonly UpdateTeam:StatusMessages = new StatusMessages("Team is successfully updated", 200);
    public static readonly DeleteTeam:StatusMessages = new StatusMessages("Team is successfully deleted", 204);
    public static readonly FailedToAddTeam:StatusMessages = new StatusMessages("Failed to add New Team", 503);
    public static readonly FailedtoUpdateTeam:StatusMessages = new StatusMessages("Failed to update the Team", 503);
    public static readonly FailedtoDeleteTeam:StatusMessages = new StatusMessages("Failed to delete the Team", 503)
    public static readonly PasswordChange:StatusMessages = new StatusMessages("Successfully changed password", 200);
    public static readonly FailedPasswordChange:StatusMessages = new StatusMessages("Failed to change password", 503);
    public static readonly IncorrectConfirmPassword:StatusMessages = new StatusMessages("New password and confirmed Password are not same", 422);
    public static readonly IncorrectPasswordComplexity:StatusMessages = new StatusMessages("New password has to be more then 8 characters, and should contain at least 1 number, 1 lower case, 1 upper case, 1 special character", 422)
    public static readonly InvalidVerificationCode:StatusMessages = new StatusMessages("Invalid Verification code", 400);
    public static readonly SendVerificationCode:StatusMessages = new StatusMessages("Successfully send Verification Code", 200);
    public static readonly FailtoSendVerificationCode:StatusMessages = new StatusMessages("Failed to send Verification Code", 503)
    public static readonly ClientNotexist:StatusMessages = new StatusMessages("Client does not exist", 404);
    public static readonly AddNewClient:StatusMessages = new StatusMessages("New Client successfull added", 201);
    public static readonly UpdateClient:StatusMessages = new StatusMessages("Client is successfully updated", 200);
    public static readonly DeleteClient:StatusMessages = new StatusMessages("Client is successfully deleted", 204);
    public static readonly FailedToAddClient:StatusMessages = new StatusMessages("Failed to add New Client", 503);
    public static readonly FailedtoUpdateClient:StatusMessages = new StatusMessages("Failed to update the Client", 503);
    public static readonly FailedtoDeleteClient:StatusMessages = new StatusMessages("Failed to delete the Client", 503)
    public static readonly CredentialNotexist:StatusMessages = new StatusMessages("Credential does not exist", 404);
    public static readonly AddNewCredential:StatusMessages = new StatusMessages("New Credential successfull added", 201);
    public static readonly UpdateCredential:StatusMessages = new StatusMessages("Credential is successfully updated", 200);
    public static readonly DeleteCredential:StatusMessages = new StatusMessages("Credential is successfully deleted", 204);
    public static readonly FailedToAddCredentail:StatusMessages = new StatusMessages("Failed to add New Credential", 503);
    public static readonly FailedtoUpdateCredential:StatusMessages = new StatusMessages("Failed to update the Credential", 503);
    public static readonly FailedtoDeleteCredential:StatusMessages = new StatusMessages("Failed to delete the Credential", 503);
    public static readonly GiveCredential:StatusMessages = new StatusMessages("Successfully give credential", 200);
    public static readonly FailedToGiveCredential:StatusMessages = new StatusMessages("Failed to give Credential", 503)
    public static readonly CertificateNotexist:StatusMessages = new StatusMessages("Certificate does not exist", 404);
    public static readonly AddNewCertificate:StatusMessages = new StatusMessages("New Certificate successfull added", 201);
    public static readonly DeleteCertificate:StatusMessages = new StatusMessages("Certificate is successfully deleted", 204);
    public static readonly FailedToAddCertificate:StatusMessages = new StatusMessages("Failed to add New Certificate", 503);
    public static readonly FailedtoUpdateCertificate:StatusMessages = new StatusMessages("Failed to update the Certificate", 503);
    public static readonly FailedtoDeleteCertificate:StatusMessages = new StatusMessages("Failed to delete the Certificate", 503);
    public static readonly InvalidCertificate:StatusMessages = new StatusMessages("Invalid certificate - wrong password, wrong pem key or currpted certificate file", 422)
    public static readonly PersonalFolderNotexist:StatusMessages = new StatusMessages("Personal folder does not exist", 404);
    public static readonly AddNewPersonalFolder:StatusMessages = new StatusMessages("New Personal Folder successfull added", 201);
    public static readonly DeletePersonalFolder:StatusMessages = new StatusMessages("Personal Folder is successfully deleted", 204)
    public static readonly InvalidName:StatusMessages = new StatusMessages("Invalid name - alphanumeric characters only", 422);

}