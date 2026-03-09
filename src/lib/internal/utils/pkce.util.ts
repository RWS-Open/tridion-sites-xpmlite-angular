export class PkceUtils{
    static generateVerifier(length:number =  64):string{
        const array = new Uint8Array(length)
        window.crypto.getRandomValues(array);
        return this.base64UrlEncode(array);
    }

    static async generateChallenge(verifier:string):Promise<string>{
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const hash = await window.crypto.subtle.digest('SHA-256', data)
        return this.base64UrlEncode(new Uint8Array(hash));
    }

    private static base64UrlEncode(array:Uint8Array):string{
        return btoa(String.fromCharCode(...array)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }
}