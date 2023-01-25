// env
const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '.env'),
});

// Nodemailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.nodemailerEmail,
        pass: process.env.nodemailerPass,
    },
});

// Mysql
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.mysqlHost,
    user: process.env.mysqlUser,
    password: process.env.mysqlPass,
    database: process.env.mysqlDatabase,
});

// Discord
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

client.once('ready', () => {
    console.log(`${client.user.username} has successfully logged in!`);
});

client.on('messageCreate', message => {
    if (message.content.split('')[0] != prefix || message.author.bot) return;

    message.content = message.content.slice(1).split(' ');

    if (!process.env.discordHelperIds.split(' ').includes(message.author.id)) {
        message.reply('You do not have the permissions to use me');
        return;
    }

    if (info.user.id == client.user.id) {
        message.reply('You can not punish me');
        return;
    }

    if (message.content[0] === 'ban') {
        // Ban user

        let info = {
            punishmentType: 'ban',
            helper: {
                id: message.author.id,
                username:
                    message.author.username +
                    '#' +
                    message.author.discriminator,
            },
            user: {
                id: message.content[1],
                username: '',
            },
            reason: '',
            attachment: '',
            datetime: new Date(message.createdTimestamp)
                .toJSON()
                .slice(0, 19)
                .replace('T', ' '),
        };

        info.reason = message.content[2];
        for (let i = 3; i < message.content.length; i++) {
            info.reason = info.reason + ' ' + message.content[i];
        }

        info.user.id = info.user.id.split('');
        for (let i = 0; i < info.user.id.length; i++) {
            if (
                info.user.id[i] == '<' ||
                info.user.id[i] == '>' ||
                info.user.id[i] == '@' ||
                info.user.id[i] == '!'
            ) {
                delete info.user.id[i];
            }
        }
        info.user.id = info.user.id.join('');

        info.user.username =
            client.users.cache.get(info.user.id).username +
            '#' +
            client.users.cache.get(info.user.id).discriminator;

        info.attachment = message.attachments.first().url;

        if (process.env.discordHelperIds.split(' ').includes(info.user.id)) {
            message.reply('You can not ban another member of staff');
            return;
        }

        message.reply(`Banned ${info.user.username} for ${info.reason}`);

        sendEmailAlert(info);
        commitPunishmentToDatabase(info);
    } else if (message.content[0] === 'kick') {
        // Kick user

        let info = {
            punishmentType: 'kick',
            helper: {
                id: message.author.id,
                username:
                    message.author.username +
                    '#' +
                    message.author.discriminator,
            },
            user: {
                id: message.content[1],
                username: '',
            },
            reason: '',
            attachment: '',
            datetime: new Date(message.createdTimestamp)
                .toJSON()
                .slice(0, 19)
                .replace('T', ' '),
        };

        info.reason = message.content[2];
        for (let i = 3; i < message.content.length; i++) {
            info.reason = info.reason + ' ' + message.content[i];
        }

        info.user.id = info.user.id.split('');
        for (let i = 0; i < info.user.id.length; i++) {
            if (
                info.user.id[i] == '<' ||
                info.user.id[i] == '>' ||
                info.user.id[i] == '@' ||
                info.user.id[i] == '!'
            ) {
                delete info.user.id[i];
            }
        }
        info.user.id = info.user.id.join('');

        info.user.username =
            client.users.cache.get(info.user.id).username +
            '#' +
            client.users.cache.get(info.user.id).discriminator;

        info.attachment = message.attachments.first().url;

        if (process.env.discordHelperIds.split(' ').includes(info.user.id)) {
            message.reply('You can not kick another member of staff');
            return;
        }

        message.reply(`Kicked ${info.user.username} for ${info.reason}`);

        sendEmailAlert(info);
        commitPunishmentToDatabase(info);
    } else if (message.content[0] === 'unban') {
        // Unban user

        let info = {
            punishmentType: 'unban',
            duration: 0,
            helper: {
                id: message.author.id,
                username:
                    message.author.username +
                    '#' +
                    message.author.discriminator,
            },
            user: {
                id: message.content[1],
                username: '',
            },
            reason: '',
            attachment: '',
            datetime: new Date(message.createdTimestamp)
                .toJSON()
                .slice(0, 19)
                .replace('T', ' '),
        };

        info.reason = message.content[2];
        for (let i = 3; i < message.content.length; i++) {
            info.reason = info.reason + ' ' + message.content[i];
        }

        info.user.id = info.user.id.split('');
        for (let i = 0; i < info.user.id.length; i++) {
            if (
                info.user.id[i] == '<' ||
                info.user.id[i] == '>' ||
                info.user.id[i] == '@' ||
                info.user.id[i] == '!'
            ) {
                delete info.user.id[i];
            }
        }
        info.user.id = info.user.id.join('');

        info.user.username =
            client.users.cache.get(info.user.id).username +
            '#' +
            client.users.cache.get(info.user.id).discriminator;

        info.attachment = message.attachments.first().url;

        if (process.env.discordHelperIds.split(' ').includes(info.user.id)) {
            message.reply('You can not unban another member of staff');
            return;
        }

        message.reply(`Unbanned ${info.user.username} for ${info.reason}`);

        sendEmailAlert(info);
        commitPunishmentToDatabase(info);
    } else {
        message.reply('Command not found');
    }
});

client.login(process.env.discordAuthToken);

function sendEmailAlert(info) {
    // Email data
    mailOptions = {
        from: process.env.nodemailerEmail,
        to: 'padmanathantom@gmail.com',
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
