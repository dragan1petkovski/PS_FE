import { Injectable } from "@angular/core";

@Injectable(
    {
        providedIn: "root"
    }
)

export class ValidationMessages
{
    private dictionary: Map<string, string> = new Map<string, string>([
        ["InvalidName", "Invalid Name - text characters only"],
        ["InvalidUserName", "Invalid Username - alphanumeric characters only"],
        ["IncorrectConfirmPassword", "New password and confirmed Password are not same"],
        ["IncorrectPasswordComplexity", "New password has to be more then 8 characters, and should contain at least 1 number, 1 lower case, 1 upper case, 1 special character"],
        ["NumberExpected", "Invalid number - only numbers are allowed"],
        ["InvalidEmail", "Invalid Email - use correct email format (Ex: example@company.com)"]

    ])

    public GetValidationMessage(name: string)
    {
        return this.dictionary.get(name)
    }
}