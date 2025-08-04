import express from "express";
import { format, join } from "path";
import * as dotenv from "dotenv";
import { WebSocket, WebSocketServer } from "ws";
import { DataTypes, Sequelize } from "sequelize";
import { randomUUID, UUID } from "crypto";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Client,
	ColorResolvable,
	Colors,
	EmbedBuilder,
	escapeMarkdown,
	Guild,
	GuildMember,
	GuildTextBasedChannel,
	IntentsBitField,
	italic,
	OverwriteType,
	Partials,
	PermissionFlagsBits,
	TextChannel,
} from "discord.js";
import { DiscordOauth } from "./classes/DiscordOAuth";
import { hostname } from "os";
import { AxiosResponse } from "axios";
import cookieParser from "cookie-parser";
import { read, readdirSync, readFileSync } from "fs";
import Twitch from "./classes/Twitch";
import { parse } from "toml";
import { ordinal_suffix_of } from "./utils";
import credits, { Credited, Credits } from "./credits";
// import { TwitchAPI } from "./classes/TwitchAPI";
import { ApiClient } from "@twurple/api";
import { TwitchAPI } from "./classes/TwitchAPI";
dotenv.config();

let isReady = false;
// let sendAutoEmbed = true;

let summoning = {
	password: "g77",
	grace: "First Steps",
};

// let guild: Guild;
let vc_channel: GuildTextBasedChannel;
let summon_channel: TextChannel;

let stopwatch = {
	time: 0,
	running: false
}

let twitchApi: TwitchAPI = new TwitchAPI(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_ACCESS_TOKEN);

(async () => {
	await twitchApi.init()
	console.log(`Twitch API initialized ${(await twitchApi.getCurrentUser()).name}`)

})()

// twitchClient.init()


// robot
// const bot = new Client({
// 	intents: [
// 		IntentsBitField.Flags.Guilds,
// 		IntentsBitField.Flags.GuildMembers,
// 		IntentsBitField.Flags.GuildMessages,
// 		IntentsBitField.Flags.MessageContent,
// 		IntentsBitField.Flags.DirectMessages,
// 		IntentsBitField.Flags.GuildPresences
// 	],
// });

// const chat = new Twitch(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET)

// bot.once("ready", async () => {
// 	// await Fighters.sync();
// 	// await Teams.sync();
// 	// await updateTowers();
// 	// await updateRoster();

// 	guild = await bot.guilds.fetch(process.env.GUILD_ID);
// 	vc_channel = (await guild.channels.fetch(
// 		process.env.UPDATE_CHANNEL
// 	)) as GuildTextBasedChannel;
// 	summon_channel = (await guild.channels.fetch(
// 		process.env.SUMMON_CHANNEL
// 	)) as TextChannel;
// 	caster_channel = (await guild.channels.fetch(
// 		process.env.CASTER_CHANNEL
// 	)) as GuildTextBasedChannel;

// 	// setInterval(() => {
// 	// 	const v = Math.ceil((timer - Date.now()) / 1000)
// 	// 	if (timer > 0 && v > 0) {
// 	// 		console.log(v)
// 	// 		const valid = Object.keys(introMessageData).filter((v) => !sentIntroMessages.includes(v));
// 	// 		for (let index = 0; index < valid.length; index++) {
// 	// 			const k = valid[index];
// 	// 			if (v <= parseInt(k)) {
// 	// 				// TODO: The TOML files should be able to handle this logic?
// 	// 				const STINKY_HACK = () => {
// 	// 					let remainingAttackers = Object.values(roster).filter(
// 	// 						(v) => v.attacking == true && v.isAlive
// 	// 					).length;
// 	// 					let remainingDefenders = Object.values(roster).filter(
// 	// 						(v) => v.attacking == false && v.isAlive
// 	// 					).length;

// 	// 					if (remainingAttackers > remainingDefenders) {
// 	// 						return `the **${attackers.emoji} ${attackers.name}** is leading with ${remainingAttackers} fighters remaining.\n-# The **${defenders.emoji} ${defenders.name}** shouldn't lose hope yet, they can still come back!`
// 	// 					}

// 	// 					if (remainingAttackers < remainingDefenders) {
// 	// 						return `the **${defenders.emoji} ${defenders.name}** is leading with ${remainingDefenders} fighters remaining.\n-# The **${attackers.emoji} ${attackers.name}** shouldn't lose hope yet, they can still come back!`
// 	// 					}

// 	// 					if (remainingAttackers == remainingDefenders) {
// 	// 						return `the war is **tied** between both towers!\n-# It's truely anyone's game at this point!`
// 	// 					}

// 	// 					return "I don't know what's happening. Must be some pretty cool shit, though."
// 	// 				}
// 	// 				vc_channel.send({
// 	// 					embeds: [
// 	// 						new EmbedBuilder().setDescription(
// 	// 							introMessageData[k]
// 	// 								.replaceAll("[COUNT_FANCY]", ordinal_suffix_of(warInfo.count))
// 	// 								.replaceAll("[ATTACKING_TOWER]", `${attackers.emoji} ${attackers.name}`)
// 	// 								.replaceAll("[DEFENDING_TOWER]", `${defenders.emoji} ${defenders.name}`)
// 	// 								.replaceAll("[LOCATION_NAME]", `<:fclocation:1268259683492167853> ${warInfo.location}`)
// 	// 								.replaceAll("[STINKY_HACK]", STINKY_HACK())
// 	// 								.replaceAll("[FIGHT_COUNT]", "7")
// 	// 								.replaceAll("[TOTAL_FIGHT_DURATION]", "44 minutes")
// 	// 								.replaceAll("[LONG_FIGHT]", "13 minutes")
// 	// 								.replaceAll("[SCORE_WIDGET]", `${attackers.emoji} ${Object.values(roster).filter((v) => v.attacking == true && v.isAlive)
// 	// 									.length
// 	// 									} - ${Object.values(roster).filter((v) => v.attacking == false && v.isAlive)
// 	// 										.length
// 	// 									} ${defenders.emoji}`)
// 	// 						)
// 	// 					],
// 	// 				});
// 	// 				sentIntroMessages.push(k)
// 	// 			}
// 	// 		}
// 	// 	}

// 	// }, 250)

// 	// loadStringSet("none")

// 	console.log(`Overlay is Running in ${hostname() != "duckyserver" ? "DEV" : "PRODUCTION"}!`);
// 	isReady = true;
// });


// async function formatMember(discordMember: GuildMember | string): Promise<string> {
// 	if (typeof discordMember == "string") {
// 		discordMember = await guild.members.fetch(discordMember);
// 	}

// 	return escapeMarkdown(discordMember.nickname
// 		? discordMember.nickname
// 		: discordMember.displayName != discordMember.user.username
// 			? discordMember.displayName
// 			: discordMember.user.discriminator == "0"
// 				? `@${discordMember.user.username}`
// 				: discordMember.user.tag);
// }

const dev_ids = ["334392742266535957"]

// http
const app = express();

app.use(cookieParser());
app.use(
	"/admin",
	express.static(join(process.cwd(), "src/web/admin/material"))
);

app.get("/wait", (req, res) => {
	res.sendFile(join(process.cwd(), "src/web/wait.html"));
});

app.get("/logout", async (req, res) => {
	if (req.cookies.token) {
		const oauth = new DiscordOauth(req.cookies.token);
		oauth.logout();

		res.cookie("token", "");
	}

	res.sendStatus(200);
});

app.get("/status", (req, res) => {
	res.sendStatus(isReady ? 200 : 503);
});

app.get("/auth", async (req, res) => {
	if (req.query["error"]) {
		res
			.status(500)
			.send(
				req.query["error_description"]
					? req.query["error_description"]
					: req.query["error"]
			);
		return;
	}

	if (!req.query["code"]) return res.sendStatus(400);

	const oauth = new DiscordOauth(null);
	const token = (await oauth
		.convertCodeToToken(req.query["code"] as string)
		.catch((err) => {
			return err.response;
		})) as AxiosResponse;

	if (token.data.error) return res.send(token.data);
	res.cookie("token", token.data.access_token);
	res.redirect(
		req.query["state"]
			? Buffer.from(req.query["state"] as string, "base64url").toString("utf8")
			: "../"
	);
});

app.get("/admin/*", async (req, res) => {
	if (!isReady) return res.redirect(`../wait?destination=${req.path}`);

	if (!req.cookies.token)
		return res.redirect(
			`https://discord.com/api/oauth2/authorize?client_id=${hostname() != "duckyserver"
				? process.env.APPLICATION_DEV_ID
				: process.env.APPLICATION_ID
			}&redirect_uri=${encodeURIComponent(
				`${hostname() != "duckyserver"
					? req.protocol + "://" + req.get("host")
					: //   "https://" + req.get("host")
					"https://panel.doctordeathdefying.live"
				}/auth`
			)}&response_type=code&scope=identify&state=${Buffer.from(
				req.path,
				"utf8"
			).toString("base64url")}`
		);

	const oauth = new DiscordOauth(req.cookies.token);

	const { data } = (await oauth.getUserInfo()) as AxiosResponse;
	// let user = await guild.members.fetch(data.id).catch((): null => {
	// 	return null;
	// });


	if (!data || !data.id) return res.sendStatus(401);

	// if (!user.permissions.has(PermissionFlagsBits.ManageRoles))
	// 	return res.sendStatus(401);

	if (![process.env.OWNER_ID, ...dev_ids].includes(data.id)) return res.sendStatus(401);
	res.sendFile(join(process.cwd(), "src/web/admin/index.html"));
});


app.get("/timer", (req, res) => {
	res.sendFile(join(process.cwd(), "src/web/timer.html"));
});

app.get("/stopwatch", (req, res) => {
	res.sendFile(join(process.cwd(), "src/web/stopwatch.html"));
});

app.get("/summontimer", (req, res) => {
	res.sendFile(join(process.cwd(), "src/web/summontimer.html"));
});

app.get("/chatheader", async (req, res) => {
	res.sendFile(join(process.cwd(), "src/web/chatheader.html"));
})

app.get("/api/twitchData", async (req, res) => {

})

app.get("/music", (req, res) => {
	const html = readFileSync(join(process.cwd(), "src/web/music.html")).toString(
		"utf8"
	);

	res.send(
		html
			.replace("HELP", req.query.dynamic == "" ? "0" : "1")
			.replace("{AAH}", req.query.oneline == "" ? "2" : "1")
			.replace("{E}", req.query.oneline == "" ? ": " : "")
			.replace("<!-- b -->", req.query.oneline == "" ? "" : "<br />")
	);
});

app.get("/battlepanel/:team", (req, res) => {
	switch (req.params.team) {
		case "attackers":
		case "defenders":
			res.sendFile(join(process.cwd(), "src/web/battlepanel.html"));
			break;

		default:
			res.sendStatus(404);
			break;
	}
});
app.get("/credits", (req, res) => {
	const html = readFileSync(join(process.cwd(), "src/web/credits.html")).toString(
		"utf8"
	);

	res.send(html)
});

// DUCKY HELL
// app.post("/setTimer/:minutes", async (req, res) => {
// 	/**

// 	 */


// 	// document.getElementById('Timer.Time').valueAsNumber = newTime.getTime();
// 	// document.getElementById('Timer.SetTime').click();

// 	console.log(minutes)

// })
// DUCKY HELL



app.listen(process.env.HTTP_PORT);

// ws
const socketServer = new WebSocketServer({
	port: parseInt(process.env.WS_PORT),
});

isReady = true;

/*

The frontend isn't using TypeScript so we're just gonna create the structure here :)

<!-- Handshake -->
S: ["hello", {}]
C: ["hello", {token?: "", intents: string[]}]
S: ["ok", {}] or close connection

*/

type WarOverlayIntents = "ROSTER" | "CURRENT_FIGHTERS" | "CREDITS";


interface Packets {
	chatData: {
		chatters: number;
		followers: number;
	}
	duckTimer: number;
	heartbeat: {};
	ducky: {};
	hello: {
		token?: string;
		intents?: WarOverlayIntents[];
		team?: "ATTACKERS" | "DEFENDERS" | "ALL";
	};
	timer: number;

	full: {

		timer: number;

		stopwatch: Packets["stopwatch"];
	};

	stopwatch: {
		time: number,
		running: boolean;
	};


}

export type Packet = {
	command: keyof Packets;
	data: any;
	id: number;
};

function createPacket<T extends keyof Packets>(command: T, data: Packets[T]) {
	return JSON.stringify({ command, data, id: 0 });
}





// async function buildCredits(caster_1: string, caster_2: string, socket?: WebSocket): Promise<Credits | null> {
// 	// let existingCredits = credits;
// 	let newCredits: Credits = {};
// 	if (!guild || !guild.available) newCredits = null;
// 	if (newCredits !== null) {

// 		let caster1Member = guild.members.cache.get(caster_1);
// 		let caster2Member = guild.members.cache.get(caster_2);

// 		newCredits = { ...credits, "today's_casters": [{ name: caster1Member.displayName, userId: caster1Member.id }, { name: caster2Member.displayName, userId: caster2Member.id }] }
// 		let supporters: Credited[] = [];
// 		guild.members.cache.filter(m => m.roles.cache.has(process.env.SUPPORTER_ROLE)).forEach(m => {
// 			let obj: Credited = { name: m.displayName, userId: m.id }
// 			let subT1Role = guild.roles.cache.get(process.env.SUB_T1_ROLE)
// 			let subT2Role = guild.roles.cache.get(process.env.SUB_T2_ROLE)
// 			let subT3Role = guild.roles.cache.get(process.env.SUB_T3_ROLE)
// 			let donatorRole = guild.roles.cache.get(process.env.DONATOR_ROLE)
// 			let boosterRole = guild.roles.cache.get(process.env.BOOSTER_ROLE)
// 			if (m.roles.cache.has(boosterRole.id)) {
// 				obj.title = boosterRole.name
// 				obj.accentColor = boosterRole.hexColor;
// 			}
// 			if (m.roles.cache.has(donatorRole.id)) {
// 				obj.title = donatorRole.name
// 				obj.accentColor = donatorRole.hexColor;
// 			}
// 			if (m.roles.cache.has(subT1Role.id)) {
// 				obj.title = subT1Role.name
// 				obj.accentColor = subT1Role.hexColor;
// 			}
// 			if (m.roles.cache.has(subT2Role.id)) {
// 				obj.title = subT2Role.name
// 				obj.accentColor = subT2Role.hexColor;
// 			}
// 			if (m.roles.cache.has(subT3Role.id)) {
// 				obj.title = subT3Role.name
// 				obj.accentColor = subT3Role.hexColor;
// 			}

// 			supporters.push(obj);

// 		})
// 		newCredits = { ...newCredits, "shard_bearers": supporters.sort((a, b) => a.title.localeCompare(b.title)) }
// 		let groups: string[] = [];
// 		Object.entries(newCredits).forEach(e => {
// 			groups.push(e[0])
// 		})
// 		console.log(groups)
// 		groups.forEach(group => {
// 			let entries = newCredits[group];
// 			entries.forEach(async (entry: Credited, index) => {
// 				// console.log(entry)
// 				if (entry.userId !== null || entry.userId !== "") {


// 					let member = guild.members.cache.get(entry.userId)
// 					if (!member) return console.log("failed", entry.userId)
// 					if (member) newCredits[group][index].imageUrl = member.displayAvatarURL({ forceStatic: false })
// 					console.log(member.user ? member.user.username : entry.userId)
// 				}
// 			})
// 		})

// 		// console.log(newCredits)
// 		// socket.emit("credits", JSON.stringify(newCredits))
// 		return newCredits;
// 	}


// }

const socketMap = new Map<string, WebSocket>();

function broadcast(packet: string) {
	for (let socket of socketMap.values()) {
		socket.send(packet);
	}
}



let timer = 0;


socketServer.on("connection", (socket, req) => {
	// app.locals.socket = socket;
	let heartbeat: NodeJS.Timeout;

	let socketId: UUID = null;
	socket.send(createPacket("hello", {}));

	let authenticated = false;



	socket.on("message", async (data) => {
		console.log(data.toString())

		const packet = JSON.parse(data.toString()) as Packet;



		// if (
		// 	packet.command != "hello" &&
		// 	packet.command != "ducky" &&
		// 	packet.command != "duckTimer" &&
		// 	!authenticated
		// )
		// 	return socket.send(createPacket("nope", {}));

		console.log(packet.command)

		switch (packet.command) {
			case "chatData": {
				broadcast(createPacket("chatData", packet.data))
				break;
			}
			case "duckTimer":
				let minutes: any = packet.data
				if (!minutes) return;
				minutes = parseInt(minutes);
				console.log(minutes)

				const newTime = new Date();

				newTime.setMilliseconds(0);
				// newTime.setHours(newTime.getHours() - 4);
				newTime.setMinutes(newTime.getMinutes() + minutes);

				// console.log()
				console.log(timer)

				timer = newTime.getTime();
				console.log(timer)
				broadcast(createPacket("timer", timer))
				break;



			case "timer": {
				// Timer just paused
				console.log("TIMER!")
				timer = packet.data;

				broadcast(createPacket("timer", timer));
				break;
			}
			case "stopwatch":
				stopwatch = packet.data;

				broadcast(createPacket("stopwatch", stopwatch))
				break;
			case "ducky":
				console.log("🦆");
				break;
			case "hello":
				socket.send(
					createPacket("full", {

						timer,
						stopwatch,
					})
				);

				if (packet.data.token) {
					const oauth = new DiscordOauth(packet.data.token);
					const { data } = await oauth.getUserInfo();
					console.log(data)
					console.log([process.env.OWNER_ID, ...dev_ids].includes(data.id))
					if (![process.env.OWNER_ID, ...dev_ids].includes(data.id)) break;


					authenticated = [process.env.OWNER_ID, ...dev_ids].includes(data.id)
				}

				socketId = randomUUID();
				socketMap.set(socketId, socket);

				heartbeat = setInterval(async () => {
					socket.send(createPacket("heartbeat", {}));
					await socket.send(createPacket("chatData", await fetchTwitchData()))
					// await twitchApi.getGoals()
				}, 5e3);
				break;



			default:
				// socket.send(createPacket("nope", {}));
				break;
		}

	});

	socket.on("close", (code, reason) => {
		socketMap.delete(socketId);
		clearInterval(heartbeat);
	});
});

async function fetchTwitchData(): Promise<{ chatters: number, followers: number, followerGoal?: number }> {
	let chatters = await twitchApi.getChatterCount();
	let followers = await twitchApi.getFollowerCount();
	if (!chatters) chatters = 0;
	if (!followers) followers = 0;


	let followerGoal = (await twitchApi.getGoals()).find(g => g.type === "follower")
	if (!followerGoal) return { chatters, followers };

	console.log(followerGoal)

	return { chatters, followers, followerGoal: followerGoal.targetAmount }
}


console.log(process.argv.includes("-dev"))
// bot.login(process.argv.includes("-dev") ? process.env.TOKEN_DEV : process.env.BOT_TOKEN);


