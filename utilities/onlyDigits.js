// funktion som sikre at der kun kan indtastes numre og ikke bogstaver
export default function onlyDigits(text) {
    return ("" + text).replace(/\D/g, "");
}