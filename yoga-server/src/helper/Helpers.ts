export class Helpers {
    public static getRandomBase64String(len) {
        let randomNumbers = require("crypto").randomBytes(Math.ceil((len * 3) / 4))
            .toString('base64') // convert to base64 format
            .slice(0, len) // return required number of characters
            .replace(/\+/g, '0') // replace '+' with '0'
            .replace(/\//g, '0'); // replace '/' with '0'
        return randomNumbers;
    }

    public static log(msg:string) {
        console.log("[" + new Date().toISOString() + "] " + msg);
    }

    public static logId(msg:string) :string {
        let id = Helpers.getRandomBase64String(8);
        console.log("[" + new Date().toISOString() + " - Error id: " + id + "] " + msg);
        return id;
    }
}
