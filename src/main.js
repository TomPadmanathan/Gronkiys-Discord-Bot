// env
const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '.env'),
});

// nodemailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.nodemailerEmail,
        pass: process.env.nodemailerPass,
    },
});

function sendEmailAlert(info) {
    mailOptions = {
        from: process.env.nodemailerEmail,
        to: process.env.nodemailerEmailRecipient,
        subject: `${info.helper.username} has ${info.punishmentType + 'ed'} ${
            info.user.username
        }`,
        html: `<table style="border: 1px solid black; border-collapse: collapse; padding: 10px;">
            <tr style="border: 1px solid black; border-collapse: collapse; padding: 10px;">
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Punishment Type</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Helper Username</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Helper Id</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">User Username</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">User Id</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Reason</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">DateTime</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Attachment</td>
            </tr>
            <tr style="border: 1px solid black; border-collapse: collapse; padding: 10px;">
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${info.punishmentType}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${info.helper.username}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${info.helper.id}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${info.user.username}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${info.user.id}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${info.reason}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${info.datetime}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${info.attachment}</td>
            </tr>
        </table>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        else console.log('Notification email sent: ' + info.response);
    });
}

// mysql
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.mysqlHost,
    user: process.env.mysqlUser,
    password: process.env.mysqlPass,
    database: process.env.mysqlDatabase,
});

function commitPunishmentToDatabase(info) {
    connection.connect(err => {
        if (err) throw err;
        console.log('Connected to the MySQL server.');

        connection.query(
            `INSERT INTO punishments(PunishmentType, HelperUsername, HelperId, UserUsername, UserId, Reason, Datetime, Attachment) VALUES ('${info.punishmentType}', '${info.helper.username}', '${info.helper.id}', '${info.user.username}', '${info.user.id}', '${info.reason}', '${info.datetime}', '${info.attachment}');`,
            (err, result) => {
                if (err) throw err;
                console.log('Inserted info in database');
            }
        );
    });
}

// discord js
const {
    Client,
    Events,
    GatewayIntentBits,
    InteractionCollector,
    Guild,
    GuildBan,
} = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const prefix = '!';

class Info {
    userid(message) {
        let userid = message.content[1].split('');
        for (let i = 0; i < userid.length; i++) {
            if (
                userid[i] == '<' ||
                userid[i] == '>' ||
                userid[i] == '@' ||
                userid[i] == '!'
            ) {
                delete userid[i];
            }
        }
        return userid.join('');
    }
    reason(message) {
        let reason = message.content[2];
        for (let i = 3; i < message.content.length; i++) {
            reason = reason + ' ' + message.content[i];
        }
        return reason;
    }
    attachment(message) {
        try {
            return message.attachments.first().url;
        } catch {
            return undefined;
        }
    }

    constructor(message) {
        this.punishmentType = message.content[0];
        this.helper = {
            id: message.author.id,
            username:
                message.author.username + '#' + message.author.discriminator,
        };
        this.user = {
            id: this.userid(message),
            username:
                client.users.cache.get(this.userid(message)).username +
                '#' +
                client.users.cache.get(this.userid(message)).discriminator,
        };
        this.reason = this.reason(message);
        this.attachment = this.attachment(message);
        this.datetime = new Date(message.createdTimestamp)
            .toJSON()
            .slice(0, 19)
            .replace('T', ' ');
    }
}

// Login to discord application
client.once('ready', () => {
    console.log(`${client.user.username} has successfully logged in!`);
});

// Listen for messages
client.on('messageCreate', message => {
    if (message.content.split('')[0] != prefix || message.author.bot) return;

    // remove prefix and split command into an array
    message.content = message.content.slice(1).split(' ');

    // Check if user has permissions to use bot
    if (!process.env.discordHelperIds.split(' ').includes(message.author.id)) {
        message.reply('You do not have the permissions to use me.');
        return;
    }

    if (message.content[0] === 'ban') {
        let info = new Info(message);

        if (process.env.discordHelperIds.split(' ').includes(info.user.id)) {
            message.reply(
                `You can not ${info.punishmentType} another member of staff.`
            );
            return;
        }
        if (info.user.id == client.user.id) {
            message.reply(`You can not ${info.punishmentType} me.`);
            return;
        }

        message.reply(`Banned ${info.user.username} for ${info.reason}.`);

        sendEmailAlert(info);
        commitPunishmentToDatabase(info);
    } else if (message.content[0] === 'kick') {
        let info = new Info(message);

        if (process.env.discordHelperIds.split(' ').includes(info.user.id)) {
            message.reply(
                `You can not ${info.punishmentType} another member of staff.`
            );
            return;
        }
        if (info.user.id == client.user.id) {
            message.reply(`You can not ${info.punishmentType} me.`);
            return;
        }

        message.reply(`Kicked ${info.user.username} for ${info.reason}.`);

        sendEmailAlert(info);
        commitPunishmentToDatabase(info);
    } else if (message.content[0] === 'unban') {
        let info = new Info(message);

        if (process.env.discordHelperIds.split(' ').includes(info.user.id)) {
            message.reply(
                `You can not ${info.punishmentType} another member of staff.`
            );
            return;
        }
        if (info.user.id == client.user.id) {
            message.reply(`You can not ${info.punishmentType} me.`);
            return;
        }

        message.reply(`Unbanned ${info.user.username} for ${info.reason}.`);

        sendEmailAlert(info);
        commitPunishmentToDatabase(info);
    } else {
        message.reply('Command not found.');
    }
});

client.login(process.env.discordAuthToken);
