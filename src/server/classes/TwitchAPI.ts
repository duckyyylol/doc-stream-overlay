import { ApiClient, HelixChannelFollower, HelixChatChatter, HelixGame, HelixGoal, HelixPaginatedResultWithTotal, HelixStream, HelixUser } from "@twurple/api";
import { StaticAuthProvider } from "@twurple/auth";

export class TwitchAPI {
    apiClient: ApiClient;
    auth: StaticAuthProvider;
    clientId: string;
    token: string;
    working_channel: string;

    constructor(clientId: string, access_token: string) {
        this.clientId = clientId;
        this.token = access_token;
        this.working_channel = process.env.TWITCH_CHANNEL_NAME
    }

    getAuthProvider(): StaticAuthProvider {
        const provider = new StaticAuthProvider(this.clientId, this.token)
        this.auth = provider;
        return provider;
    }

    async getCurrentUser(): Promise<HelixUser> {
        let res: HelixUser | null;
        res = await this.apiClient.users.getUserByName(this.working_channel)
        if (!res) return null;
        console.log(res)
        return res;
    }


    async currentUserId(): Promise<string | null> {
        let u = await this.getCurrentUser();
        if (!u) return null;
        return u.id;
    }

    async getChatterCount(): Promise<number> {
        let res: HelixPaginatedResultWithTotal<HelixChatChatter> | null;
        res = await this.apiClient.chat.getChatters(await this.currentUserId())
        if (!res) return 0;
        return res.total;
    }

    async getFollowerCount(): Promise<number> {
        let res: HelixPaginatedResultWithTotal<HelixChannelFollower> | null;
        res = await this.apiClient.channels.getChannelFollowers(await this.currentUserId())
        if (!res) return 0;
        return res.total;
    }

    async getCurrentStream(): Promise<HelixStream | null> {
        let res: HelixStream | null;
        res = await this.apiClient.streams.getStreamByUserId(await this.currentUserId());
        if (!res || res == null) return null;
        return res;
    }

    async getCurrentGame(): Promise<HelixGame | null> {
        let stream: HelixStream | null = await this.getCurrentStream();
        if (!stream || stream == null) return null;
        return stream.getGame();
    }

    async getGoals(): Promise<HelixGoal[]> {
        let res: HelixGoal[] | null;
        res = await this.apiClient.goals.getGoals(await this.currentUserId())
        if (!res) return null;
        return res;
    }

    async init(): Promise<ApiClient> {
        this.getAuthProvider();
        const apiClient = new ApiClient({ authProvider: this.auth, logger: { timestamps: true }, })
        this.apiClient = apiClient;
        // console.log(`Twitch Client is logged in: ${this.currentUser.displayName}`)
        return apiClient;
    }
}