import { Method } from "axios";
import { URLSearchParams } from "url";

enum TWITCH_URI {
    ID = "id.twitch.tv",
    API_HELIX = "api.twitch.tv/helix"
}

type KeyPair = {
    [key: string]: string
}

export default class {
    private token: string;
    private readonly clientSecret: string;
    readonly clientId: string;

    constructor(_clientId: string, _clientSecret: string){
        this.clientId = _clientId;
        this.clientSecret = _clientSecret

        this.obtainToken();
    }

    private async sendRequest(domain: string, path: string, method: Method, authenticate: boolean = true, _headers?: KeyPair, url?: KeyPair, body?: object){
        const headers = new Headers();
        if(_headers){
            for (let index = 0; index < Object.keys(_headers).length; index++) {
                const key = Object.keys(_headers)[index];
                const value = _headers[key];

                headers.append(key, value)
            }
        }
        
        if(authenticate){
            headers.append("Authorization", `Bearer ${this.token}`)
        }

        let req: RequestInit = {
            method
        };

        const urlParams = new URLSearchParams();
        if(url){
            for (let index = 0; index < Object.keys(url).length; index++) {
                const key = Object.keys(url)[index];
                const value = url[key];

                urlParams.append(key, value)
            }
        }

        if(headers) {
            req.headers = headers;
        }

        if(body) {
            req.body = JSON.stringify(body)
        }
        
        const response = await fetch(`https://${domain}${path}${urlParams.size > 0 ? `?${urlParams.toString()}` : ""}`, req);

        return response;
    }

    private async obtainToken() {
        const response = await this.sendRequest(
            TWITCH_URI.ID,
            "/oauth2/token",
            "POST",
            false,
            null,
            {
                "client_id": this.clientId,
                "client_secret": this.clientSecret,
                "grant_type": "client_credentials"
            }
        )
        
        const {access_token, expires_in} = await response.json();

        this.token = access_token;
    }

    sendChatMessage(broadcaster: string){
        
    }
}