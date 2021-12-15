// funktion som tjekker om email er gyldig
export default function isValidEmail(email)
{

    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
}