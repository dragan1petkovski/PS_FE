let UpperCase = () => String.fromCodePoint(Math.round(Math.random()*(90-65))+65)

let LowerCase = () => String.fromCodePoint(Math.round(Math.random()*(122-97))+97)

let Numbers = () => (Math.round((Math.random()*1000*Math.random()*5000))%10).toString()

let SpecialCharacter = () =>
{
    let sepcialCharacters = [33,34,35,36,37,38,39,42,43,44,45,46,47,58,59,60,61,62,63,64,92,94,95,96,124,125]
    let number = Math.round((Math.random()*1000*Math.random()*5000))%sepcialCharacters.length
    return String.fromCodePoint(Number(sepcialCharacters[number]))
}
let Brackets = () =>
{
    let brackets = [40,41,91,93,123,125]
    let bracketList = Math.round((Math.random()*1000*Math.random()*5000))%brackets.length
    return String.fromCodePoint(Number(brackets[bracketList]))
}

function PasswordStringGenerator(ListOfFunctions: any, passwordLength: number)
{
    let passwordString = ""
    for(let i =0; i < passwordLength; i++)
    {
        let chooseCharacter = Math.round((Math.random()*1000*Math.random()*5000))%ListOfFunctions.length
        let character = ListOfFunctions[chooseCharacter]()
        passwordString += character
    }
    return passwordString
}

export function GeneratePassword()
{
    let RandomCharacter:any = []
    let passwordLength = document.getElementById("passwordLength") as HTMLInputElement
    let passwordLengthNumber = 0;
    
    try{
        passwordLengthNumber = Number(passwordLength.value)
        if(passwordLengthNumber < 8)
        {
            //Alert baner Password is not considered secure
            console.log("Password is not considered secure")
        }
    }
    catch (error)
    {
        console.error("Enter number as input")
    }
    
    let upperCase = document.getElementById("UpperCase") as HTMLInputElement
    if(upperCase.checked)
    {
        RandomCharacter.push(UpperCase)
    }

    let specialCharacter = document.getElementById("SpecialCharacter") as HTMLInputElement
    if(specialCharacter.checked)
    {
        RandomCharacter.push(SpecialCharacter)
    }

    let lowerCase = document.getElementById("LowerCase") as HTMLInputElement
    if(lowerCase.checked)
    {
        RandomCharacter.push(LowerCase)
    }

    let numbers = document.getElementById("Numbers") as HTMLInputElement
    if(numbers.checked)
    {
        RandomCharacter.push(Numbers)
    }

    let brackets = document.getElementById("Brackets") as HTMLInputElement
    if(brackets.checked)
    {
        RandomCharacter.push(Brackets)
    }

    return PasswordStringGenerator(RandomCharacter,passwordLengthNumber)
}