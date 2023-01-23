// Nodemailer
const nodemailer = require('nodemailer');


// Connection info
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.nodemailerEmail,
        pass: process.env.nodemailerPass
    }
});

// env
const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '.env')
})

// Discord
const { Client, Events, GatewayIntentBits, InteractionCollector, Guild, GuildBan } = require('discord.js');

const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const prefix = '!'

client.once('ready', () => {
	console.log(`${client.user.username} has successfully logged in!`)
})



client.on('messageCreate', (message) => {
	if((message.content.split('')[0]) != prefix || message.author.bot) return
	message.content = message.content.slice(1).toLowerCase().split(' ');

	if(message.content[0] === 'ban') {
		// Ban user

		let banInfo = {
			helper: {
				id: message.author.id,
                username: message.author.username + '#' + message.author.discriminator,
			},
			user: {
                id: message.content[1],
                username: '',
            },
            reason: '',
            attachment: '',
			dateTime: new Date(message.createdTimestamp).toJSON().slice(0, 19).replace('T', ' ')
		};

		banInfo.reason = message.content[2]
		for(let i = 3; i < message.content.length; i++) {
			banInfo.reason = banInfo.reason + ' ' + message.content[i]
		}

        banInfo.user.id = banInfo.user.id.split('')
        for(let i = 0; i < banInfo.user.id.length; i++) {
			if(banInfo.user.id[i] == '<' || banInfo.user.id[i] == '>' || banInfo.user.id[i] == '@' || banInfo.user.id[i] == '!') {
                delete banInfo.user.id[i];
            }
		}
        banInfo.user.id = banInfo.user.id.join('')

        banInfo.user.username = client.users.cache.get(banInfo.user.id).username + '#' + client.users.cache.get(banInfo.user.id).discriminator

        banInfo.attachment = message.attachments.first().url

        console.log(banInfo)
		console.table(banInfo)
	}
	else if(message.content[0] === 'kick') {
		// Kick user
        








	}
	else if(message.content[0] === 'unban') {
		// Unban user
	}
	else {
		message.reply('Command not found');
	}
})



client.login(process.env.discordAuthToken);



function SendEmailAlert(user) {
    // Email data
    mailOptions = {
        from: process.env.nodemailerEmail,
        to: 'padmanathantom@gmail.com',
        subject: `${'USERNAME'} just got banned by ${'HELPER'}`,
        html: `<h1>${'USERNAME'} just got banned by ${'HELPER'}</h1>
        <table style="border: 1px solid black; border-collapse: collapse; padding: 10px;">
            <tr style="border: 1px solid black; border-collapse: collapse; padding: 10px;">
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Staff</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">User</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">DateTime</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Reason</td>
            </tr>
            <tr style="border: 1px solid black; border-collapse: collapse; padding: 10px;">
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${'HELPER'}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${'USER'}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${new Date().toJSON().slice(0, 19).replace('T', ' ')}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${'REASON'}</td>
            </tr>
        </table>`
    };

    // Send verification email
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        else console.log('Notification email sent: ' + info.response);
    });
}