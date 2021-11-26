export default function onlyDigits(text) {
    return ("" + text).replace(/\D/g, "");
}