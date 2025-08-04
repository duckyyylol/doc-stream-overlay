import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { hostname } from "os";

enum DISCORD_API_ENDPOINTS {
	TOKEN_GRANT = "/oauth2/token",
	TOKEN_REVOKE = "/oauth2/token/revoke",
	USER_ME = "/users/@me",
	USER_GUILDS = "/users/@me/guilds",
	GUILD_MEMBER = "/users/@me/guilds/{guild.id}/member",
}

export class DiscordOauth {
	token: string;
	endpoint: string = "https://discord.com/api/v10";

	constructor(token: string | null) {
		this.token = token;
	}

	async convertCodeToToken(code: string) {
		const tokenData = await this.makeRequest(
			DISCORD_API_ENDPOINTS.TOKEN_GRANT,
			"POST",
			{
				grant_type: "authorization_code",
				code,
				redirect_uri: `${hostname() != "tower-maiden"
					? "http://localhost:8085"
					: //   "https://would-offering-any-technology.trycloudflare.com"
					"https://panel.doctordeathdefying.live"
					}/auth`,
			},
			true
		);

		return tokenData;
	}

	async getUserInfo() {
		const userInfo = await this.makeRequest(
			DISCORD_API_ENDPOINTS.USER_ME,
			"GET",
			{}
		);

		return userInfo;
	}

	async getUserGuilds() {
		const userGuilds = await this.makeRequest(
			DISCORD_API_ENDPOINTS.USER_GUILDS,
			"GET",
			{}
		);

		return userGuilds;
	}

	async getGuildMember(guildId: string) {
		const guildMember = await this.makeRequest(
			DISCORD_API_ENDPOINTS.GUILD_MEMBER.replace("{guild.id}", guildId),
			"GET",
			{}
		);

		return guildMember;
	}

	async makeRequest(
		endpoint: DISCORD_API_ENDPOINTS | string,
		method: string,
		data: object,
		authAsApplication: boolean = false
	): Promise<AxiosResponse> {
		const options: AxiosRequestConfig = {
			data,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			method,
		};
		if (authAsApplication)
			options["auth"] = {
				username:
					hostname() != "tower-maiden"
						? process.env.APPLICATION_DEV_ID
						: process.env.APPLICATION_ID,
				password:
					hostname() != "tower-maiden"
						? process.env.APPLICATION_DEV_SECRET
						: process.env.APPLICATION_SECRET,
			};
		if (!authAsApplication)
			options.headers["Authorization"] = `Bearer ${this.token}`;

		const res = await axios(`${this.endpoint}${endpoint}`, options);

		return res;
	}

	logout() {
		this.makeRequest(
			DISCORD_API_ENDPOINTS.TOKEN_REVOKE,
			"POST",
			{
				token: this.token,
				token_type_hint: "access_token",
			},
			true
		);
	}
}
