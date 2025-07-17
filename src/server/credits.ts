export interface Credited {
    name: string;
    imageUrl?: string;
    title?: string;
    inviteCode?: string;
    userId?: string;
    accentColor?: string;
}

export interface Credits {
    [group: string]: Credited[];
}

export const credits: Credits = {
    "affiliates": [
        {
            name: "Roundtable",
            imageUrl: "https://cdn.discordapp.com/icons/944126348367114291/a3b582b411b693081357bb7ac1ae5df5.webp?size=2048",
            inviteCode: "ROUNDTABLE-944126348367114291"
        },
        {
            name: "Elden Collaborative Online",
            imageUrl: "https://cdn.discordapp.com/icons/998753917636718672/a_b8ab0790a082dd52d80833e92c37dfab.gif?size=2048&quality=lossless",
            inviteCode: "ELDENCOLLABONLINE"
        },
        {
            name: "The Box",
            imageUrl: "https://cdn.discordapp.com/icons/1041496975503282236/d32445d6603c21f98b10ad29e1bfb1b1.png?size=2048&quality=lossless",
            inviteCode: "9USFKX3KTR"
        }
    ],
    "server_staff": [
        {
            name: "GloamEyedQueen",
            title: "Founder",
            userId: "1130664135005311127"
        },
        {
            name: "ducky",
            title: "Leadership",
            userId: "334392742266535957"
        },
        {
            name: "the0show",
            title: "Leadership",
            userId: "468093150217371649"
        },
        {
            name: "Mythos",
            title: "Community Manager",
            userId: "533113946979303443"
        },
        {
            name: "Nyx_Does_Games",
            title: "Global Community Moderator",
            userId: "1153002816625967264"
        },
        {
            name: "Sir Picolas",
            title: "Community Moderator",
            userId: "978390663160815646"
        },
        {
            name: "Doctordeathdefying",
            title: "Community Moderator",
            userId: "952379880450949121"
        },
        {
            name: "Panda-Cheezy",
            title: "Community Moderator",
            userId: "862636226724626432"
        }
    ],
    "tower_lords": [
        {
            name: "Doctordeathdefying",
            title: "The Ancient Dragon Cult",
            userId: "952379880450949121"
        },
        {
            name: "Camo- Slayer of Gods",
            title: "Tower of Bloodflame",
            userId: "427640776110112769"
        },
        {
            name: "KngCinnamon",
            title: "Reedland Shogunate",
            userId: "781303256881954818"
        },
        {
            name: "Latrommi",
            title: "Descendants of the Frozen Cosmos",
            userId: "882539998522519562"
        },
        {
            name: "Panda-Cheezy",
            title: "Recusant Syndicate",
            userId: "862636226724626432"
        },
        {
            name: "Pandilady",
            title: "Eternal City of Night",
            userId: "1263613758442573927"
        },
    ]
}

export default credits;