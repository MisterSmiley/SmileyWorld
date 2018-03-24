const Discord = require("discord.js");
const bot = new Discord.Client();
const os = require('os');
const fs = require("fs");
const economy = require('discord-eco');
const moment = require('moment');
const encode = require('strict-uri-encode');
const Fortnite = require('fortnite');
const connection = new Map();
const stats = new Fortnite(process.env.FORTNITEKEY);
const figlet = require('figlet');
const config = ('./config.json');
const money = require('discord-money');
const thing = require('mathjs');
const request = require('request');
const maths = thing.parser();
const started = Date();
const notes = require('./notes.json');
const warns = require('./warns.json');
const sbl = require("./blservers.json");
const ubl = require("./blusers.json");
const weather = require('weather-js');
var jimp = require("jimp");
var gm = require("gm");
var parseString = require('xml2js').parseString;
var nani = require("nani").init(process.env.LOGIN, process.env.KEY);
var nedb = require("nedb")
const Webhook = require("webhook-discord")
const yt_api_key = process.env.YTBTOKEN;
const bot_controller = "300911569930289154";
const prefix = "&";
const discord_token = process.env.TOKEN;
const modRole = 'Economy Bot Admin';
const music = ('runtime/music.js');
const hook = new Webhook("https://discordapp.com/api/webhooks/413814187366809601/" + process.env.HOOKTOKEN)
var youtubeNode = require("youtube-node");
var ytdl = require("ytdl-core");

var youtube = new youtubeNode();

youtube.setKey(yt_api_key);
youtube.addParam('type', 'video');

var ffmpeg = require("ffmpeg-binaries");
var search = require('youtube-search');
var snekfetch = require("snekfetch");
const opts = {
  part: 'snippet',
  maxResults: 10,
  key: yt_api_key
}

var express = require("express")
var app = express();

bot.login(discord_token)

bot.on("ready", ready => {
    console.log(`SmileyBot est maintenant en ligne avec ${bot.guilds.size} serveurs et ${bot.users.size} membres`);
    bot.user.setActivity(`&help | by Mister Smiley#6699 | avec ${bot.users.size} membres`, { 
      'type': 'LISTENING'	
    })
    bot.user.setStatus('dnd')
});

bot.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  bot.user.setGame(`&help | by Mister Smiley#6699 | avec ${bot.users.size} membres`)
  bot.guild.defaultChannel.sendMessage("Hey ! Je suis le SmileyBot ! \nQuelqu'un avec la permission `manage-server` m'a invité via Oauth. \nEnvoyez `&help` afin de voir toutes les commandes que je peut faire :smile:")
});

bot.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  bot.user.setGame(`&help | by Mister Smiley#6699 | avec ${bot.users.size} membres`)
});

bot.on('guildMemberAdd', async member => {
    console.log(member.user.username + ' est arrivé sur le serveur')
    var role = member.guild.roles.find('name', "🔘- Smil' Membres");
    await member.addRole(role)
    .then(() => console.log(`Added ${role.name} to ${member.user.tag}`))
    .catch(err => console.log(`Error while adding ${role.name} to ${member.user.tag}`))
    var channel = member.guild.channels.find('name', 'discussion-1');
    if (!channel) return
    let newMemberEmbed = new Discord.RichEmbed()
    .setAuthor(member.user.username + ' ' + member, member.user.displayAvatarURL)
    .addField('New User', 'Passe un bon moment !')
    .setTimestamp()
    .setColor('RANDOM')
if (!channel) return;
channel.send(newMemberEmbed);
    bot.user.setGame(`&help | by Mister Smiley#6699 | avec ${bot.users.size} membres`)
});

bot.on('guildMemberRemove', async member => {
  var channel = member.guild.channels.find('name', 'discussion-1');
  if (!channel) return
  channel.send(`Au revoir ` + member.user + `.`);
  bot.user.setGame(`&help | by Mister Smiley#6699 | avec ${bot.users.size} membres`)
});

bot.on("message", async message => {
  if(message.author.bot) return;

  if(message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
    if (sbl.indexOf(message.guild.id) != -1 && message.content.startsWith(prefix)) {
      message.channel.send("This server is blacklisted")
      return
    }
    if (ubl.indexOf(message.author.id) != -1 && message.content.startsWith(prefix)) {
      message.channel.send("You are blacklisted and can not use the bot!")
      return
    }

  if(command === "ping") {
    const m = await message.channel.send("Ping ?");
    m.edit(`:ping_pong: Pong ! Latency is **${m.createdTimestamp - message.createdTimestamp}**ms. \nAPI Latency is **${Math.round(bot.ping)}**ms`);
  }
  if(command === "say") { 
	  if(!message.member.roles.some(r=>["Smil' Staff"].includes(r.name)) )
      return message.reply("Tu n'as pas les permissions pour le faire !");

    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});
    message.channel.send(sayMessage);
  }
  if(command === "embed") {
    const embedMessage = args.join(" ");
    message.delete().catch(O_o=>{});
	const embed = new Discord.RichEmbed()
	.setAuthor(message.author.username, message.author.avatarURL)
	.setColor("#ffef04")
	.addField(`Message de ${message.author.username}`, embedMessage)
	.setTimestamp()
	.setFooter("© SmileyBot")
	message.channel.send(embed)
	}
  if(command === "kick") {
    if(!message.member.hasPermission('KICK_MEMBERS'))
      return message.reply("Tu n'as pas les permissions pour le faire !");
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Veuillez mentionner quelqu'un");
    if(!member.kickable)
      return message.reply("Je n'ai pas les permissions requises.");
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Veuillez indiquer une raison");
    await member.kick(reason)
      .catch(error => message.reply(`Pardon ${message.author} Je ne peux pas le ban car : ${error}`));
    message.reply(`${member.user.tag} à été kick par ${message.author.tag} car : ${reason}`);

  }

  if(command === "ban") {
    if(!message.member.hasPermission('BAN_MEMBERS'))
      return message.reply("Tu n'as pas les permissions pour le faire !");
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Veuillez mentionner quelqu'un");
    if(!member.bannable)
      return message.reply("Je n'ai pas les permissions requises");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Veuillez indiquer une raison");

    await member.ban(reason)
      .catch(error => message.reply(`Pardon ${message.author} Je ne peux pas le ban car : ${error}`));
    message.reply(`${member.user.tag} à été banni par ${message.author.tag} car : ${reason}`);
  }
  if(message.content.includes(bot.user)){
    message.channel.send('Mon prefix est ``&``');
    }    
  if(command === "help") {
	  var embed = new Discord.RichEmbed()
	  .setTitle("SmileyBot")
	  .addField("Commandes Publics", "&help - Affiche la Page d'aide \n&afk <reason> - Vous met afk \n&remove-afk - Enleve votre AFK \n&weather - Vous donne la meteo de l'endroit demandé \n&ping - Donne le Ping du Bot et le l'API \n&rate - Vous donne une note sur **20** \n&ascii - Met votre message en ascii \n&fortnite <plateform> <user> - Donne des infos sur un compte Fortnite \n&lmgtfy <recherche> - Fait une recherche avec **lmgtfy** \n&anime <recherche> - Recherche un animé \n&manga <recherche> - Recherche un manga \n&character <recherche> - Recherche un personnage d'animé ou de manga \n&notes <note> - Fait une note \n&mynotes - Vous pouvez voir vos notes", true)
    .addField("Jeux", "&rps <rock|paper|scissors> - Fait un pierre, feuille ciseaux avec le bot \n&dice <nombre entre 1-6> - Vous pariez sur un dé")
    .addField("Images", "&dog - Affiche une image aleatoire de chien \n&cat - Affiche une image aleatoire de chat \n&avatar - Affiche votre avatar \n&smiley - Affiche un Smiley aleatoire \n&hug <user> - Vous faites un calin rempli d'amour à quelqu'un \n&illegal - Trump vous dit ce qui est illegal")
	  .addField("Levels", "&info - Vous dit votre level")
	  .addField("Musique (En Reconstruction)", "&play - Joue la musique demander \n&skip - Vote pour passer à la musique suivante \n&clear - Clear la playlist (Admin du Bot uniquement)")
    .addField("Economie <:Coins:411833370696351755>", "&daily - Recuperer ainsi vos Coins Quotidien \n&money - Montre votre Money total \n&give {user} (en dev) - Donner de la monnaie à quelqu'un \n&shop - Affiche le Magasin")
	  .addField("Moderation", "&say - Fait parler le Bot \n&purge - Supprime le nombre de messages voulu \n&kick - Kick la personne voulu \n&ban - Ban la personne voulu.")
    .addField("Modération Economie", "&add-money {user} - Ajoute de la monnaie à une personne \n&eco-ban {user} (en dev) - Ban l'utilisateur du module **Economie**")
    .setColor("#ffef04")
	  .addField("Owner", "&eval - Fait un eval \n&left - Force le bot a quitté un serveur \n&name <nom> - Donne un nouveau nom au bot \n&shutdown - Eteint le bot")
	  .addField("Info", "&serverinfo - Donne des infos à propos du serv \n&botinfo - Donne des infos à propos du bot \n&sys - Donne des infos sur le systeme du bot \n&uptime - Vous donne l'uptime du bot")
	  .setColor("#ffef04")
	  .setTimestamp()
    .setThumbnail("https://cdn.discordapp.com/attachments/387213053428498432/409292518820282370/logo.png")
	  .setFooter("© SmileyBot")
	message.channel.sendEmbed(embed);
  }
  if(command === "avatar") {
	  var embed = new Discord.RichEmbed()
	  .setTitle("SmileyBot")
	  .setImage(message.author.avatarURL)
	  .setColor("#ffef04")
	  .setTimestamp()
	  .setFooter("© SmileyBot")
	message.channel.sendEmbed(embed);
  }

  if(command === "money") {
    money.fetchBal(message.author.id).then((i) => {
    var embed = new Discord.RichEmbed()
    .setDescription(`**${message.guild.name} Bank**`)
    .setColor("#ffef04")
    .addField('Account Holder', message.author.username,true)
    .addField('Account Balance', `${i.money} <:MoneyBag:412263033813860354>`,true)
    message.channel.send(embed);
  })
  }
  if(command === "add-money") {
	 if (!message.member.roles.find('name', modRole)) { 
            message.channel.send('**You need the role `' + modRole + '` to use this command...**');
            return;
        }

        if (!args[0]) {
            message.channel.send(`**You need to define an amount. Usage: ${prefix}add-money <amount> <user>**`);
            return;
        }

        if (isNaN(args[0])) {
            message.channel.send(`**The amount has to be a number. Usage: ${prefix}add-money <amount> <user>**`);
            return;
        }

        let defineduser = '';
        if (!args[1]) {
            defineduser = message.author.id;
        } else {
            let firstMentioned = message.mentions.users.first();
            defineduser = firstMentioned.id;
        }

        money.updateBal(defineduser, parseInt(args[0])).then((i) => {
            message.channel.send(`**User defined had ${args[0]} added from their account.**`)
        });
  }
  if(command === "remove-money") {
    if (message.author.id === "300911569930289154") {
            message.channel.send('**You can not use this command...**');
            return;
        }

        if (!args[0]) {
            message.channel.send(`**You need to define an amount. Usage: ${prefix}remove-money <amount> <user>**`);
            return;
        }

        if (isNaN(args[0])) {
            message.channel.send(`**The amount has to be a number. Usage: ${prefix}remove-money <amount> <user>**`);
            return;
        }

        let defineduser = '';
        if (!args[1]) {
            defineduser = message.author.id;
        } else {
            let firstMentioned = message.mentions.users.first();
            defineduser = firstMentioned.id;
        }

        money.updateBal(defineduser, parseInt(args[0])).then((i) => {
            message.channel.send(`**User defined had ${args[0]} subtraction from their account.**`)
        });
  }
  if(command === "shop") {
    var embed = new Discord.RichEmbed()
    .setTitle("SmileyBot")
    .setColor("#ffef04")
    .addField("Roles", "**V.I.P** - 15000 <:Coins:411833370696351755> \n**V.I.P Legendes** - 25000 <:Coins:411833370696351755> \n**V.I.P Mythiques** - 50000 <:Coins:411833370696351755>")
    .addField("Custom Commands", "**&**<custom command> - 40000 <:Coins:411833370696351755> \n**!**<custom command> - 30000 <:Coins:411833370696351755> \n**/**<custom command> - 20000 <:Coins:411833370696351755> \n**?**<custom command> - 15000 <:Coins:411833370696351755>")
    .setTimestamp()
    .setFooter("© SmileyBot")
    message.channel.send(embed);
  }
  if(command === "info") {
    if (message.author.bot) return;

    if (!points[message.author.id]) points[message.author.id] = {
      points: 0,
      level: 0
    };
    let userData = points[message.author.id];
    userData.points++;

    let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
    if (curLevel > userData.level) {
      userData.level = curLevel;
      message.reply(`:up: Tu est passé level **${curLevel}** ! Gg !`);
    }
    fs.writeFile("./points.json", JSON.stringify(points), (err) => {
      if (err) console.error(err)
    });
    money.fetchBal(message.author.id).then((i) => {
    var embed = new Discord.RichEmbed()
    .setTitle("SmileyBot")
    .setColor("#ffef04")
    .addField("Levels", `**${userData.level}**`)
    .addField("Money", `**${i.money}** <:MoneyBag:412263033813860354>`)
    .setTimestamp()
    .setThumbnail(message.author.avatarURL)
    .setFooter("© SmileyBot")
    message.channel.send(embed);
  })
  }
  if(command === "daily") {
    if (money[message.author.username + message.guild.name] != moment().format('L')) {
                    money[message.author.username + message.guild.name] = moment().format('L')
                    money.updateBal(message.author.id, 750).then((i) => {
                        message.channel.send({embed: {
                            color: 3447003,
                            description: 'Recieved your **750** <:Coins:411833370696351755>.',
                            author: {
                                name: `${message.author.username}#${message.author.discriminator}`,
                                icon_url: message.author.avatarURL
                            }
                        }});
                    })
                } else {
                    message.channel.send({embed: {
                        color: 3447003,
                        description: 'You already recieved your dailies. Check later **' + moment().endOf('day').fromNow() + '**.', // When you got your daily already, this message will show up.
                        author: {
                            name: `${message.author.username}#${message.author.discriminator}`,
                            icon_url: message.author.avatarURL
                        }
                    }});
                }
            }
  if (command === 'purge') { 
        async function purge() {
            message.delete(); 

            if(!message.member.hasPermission('MANAGE_MESSAGE'))
              return message.reply("Tu n'as pas les permissions pour le faire !");

            if (isNaN(args[0])) {
                message.channel.send('Please use a number as your arguments. \n Usage: ' + prefix + 'purge <amount>'); 
                return;
            }

            const fetched = await message.channel.fetchMessages({limit: args[0]}); 
            console.log(fetched.size + ' messages found, deleting...'); 

            message.channel.bulkDelete(fetched)
                .catch(error => message.channel.send(`Error: ${error}`)); 

        }

        purge();
    }

    if (command === 'weather') {
      weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) { 
        if (err) message.channel.send(err);
  
          if (result.length === 0) {
              message.channel.send('**Please enter a valid location.**') 
              return;
          }
            var current = result[0].current;
            var location = result[0].location; 
            const embed = new Discord.RichEmbed()
                .setDescription(`**${current.skytext}**`)
                .setAuthor(`Weather for ${current.observationpoint}`) 
                .setThumbnail(current.imageUrl) 
                .setColor("#ffef04")
                .addField('Timezone',`UTC${location.timezone}`, true) 
                .addField('Degree Type',location.degreetype, true)
                .addField('Temperature',`${current.temperature} Degrees`, true)
                .addField('Feels Like', `${current.feelslike} Degrees`, true)
                .addField('Winds',current.winddisplay, true)
                .addField('Humidity', `${current.humidity}%`, true)
                message.channel.send({embed});
        });
	}
  if(command === "cat") {
				  request("http://random.cat/meow?filter=mp4,webm", function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            if (typeof (body) != "undefined") {
								const embed = new Discord.RichEmbed()
								.setColor("#ffef04")
								.setImage("http://random.cat/" + body)
								.setTimestamp()
								.setFooter("© SmileyBot")
                                message.channel.send(embed);
                            }
                            else {
                                message.channel.send("Things are going wrong all over.");
                            }
                        }
                    });
    }
  if (command === "eval") {
                  if (message.author.id === "300911569930289154") {
                    try {
                      let code = message.content.split(" ").splice(1).join(" ")

                      let result = eval(code)


                      message.channel.send(result)

                    } catch (err) {

                      message.channel.send("```Fix\n" + err + "\n```")
                    }
                  } else {
                    message.channel.send("Sorry, you do not have permissisons to use this command, **" + message.author.username + "**.")

                  }
                }
        if(command === 'ascii') {
          const asciiMessage = args.join(" ");
          figlet(asciiMessage, function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            message.channel.send("```" + data + "```")
        });
        }
    if(command === "dog") {
      request("http://random.dog/woof?filter=mp4,webm", function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            if (typeof (body) != "undefined") {
								const embed = new Discord.RichEmbed()
								.setColor("#ffef04")
								.setImage("http://random.dog/" + body)
								.setTimestamp()
								.setFooter("© SmileyBot")
                                message.channel.send(embed);
                            }
                            else {
                                message.channel.send("Things are going wrong all over.");
                            }
                        }
                    });
    }
    if (command === "balance") {
      money.fetchBal(message.author.id).then((i) => {
          message.channel.send(`**Balance:** ${i.money} <:MoneyBag:412263033813860354>
`);
            })
        }
    if (command === "serverinfo") {
			const embed = new Discord.RichEmbed()
			.setAuthor(message.guild.name, message.guild.iconURL)
			.setColor("#ffef04")
      .addField('Server Informations', `**Owner** : ` + message.guild.owner.user.tag + `\n**Server ID** : ` + message.guild.id + `\n**MemberCount** : ` + message.guild.memberCount + `\n**Server ID** : ` + message.guild.id + ` \n**Location** : ` + message.guild.region + ` \n**Created At** : ` + message.guild.createdAt.toLocaleString(), true)
			.setTimestamp()
			.setFooter(bot.user.username, bot.user.avatarURL);

		  message.channel.send({embed});
		}
    if (command === "bugreport") {
		message.delete()
			message.reply("Bug report send !");
			const sayMessage = args.join(" ");
			hook.info("Support Hook (Support)", message.author.username + " (id: " + message.author.id + ") has reported this bug : " + sayMessage);
    }
	if (command === "name") {
    if (message.author.id === config.owner_id ) {
    var commande = message.content.split(" ");
	bot.user.setUsername(commande[1]);
	}
  if(command === "afk") {
    let afk = JSON.parse(fs.readFileSync("./afks.json", "utf8"));
  if (afk[message.author.id]) {
  return message.channel.send("Erreur ! Tu es deja afk");
  }else{
  let args1 = message.content.split(" ").slice(1);
  if (args1.length === 0) {
  afk[message.author.id] = {"reason" : true};
  message.channel.send(`tu es désormais afk, met **${prefix}remove-afk** pour enlever ton afk`).then(x => DeleteQueue.add(x, 10000));
  }else{
  afk[message.author.id] = {"reason" : args1.join(" ")};
  message.delete();
  message.channel.send(`tu es désormais afk, met **${prefix}remove-afk** pour enlever ton afk`).then(x => DeleteQueue.add(x, 10000));
  }
  fs.writeFile("./afks.json", JSON.stringify(afk), (err) => { if (err) console.error(err);});
  }
}
  if(command === "remove-afk") {
    let afk = JSON.parse(fs.readFileSync("./afks.json", "utf8"));
      if (afk[message.author.id]) {
      delete afk[message.author.id];
      if (message.member.nickname === null) {
      message.channel.send(" re, j'ai enlever votre afk");
      }else{
      message.channel.send(" re, j'ai enlever votre afk");
      }
      fs.writeFile("./afks.json", JSON.stringify(afk), (err) => { if (err) console.error(err);});
      }else{
      message.channel.send("Erreur ! Tu n'est pas afk");
      }
    }
    if (command === "illegal") {
if (message.channel.type === "dm") return;
let args = message.content.split(" ").slice(1);
 	let args1 = args.join(' ');
let illegal = `https://storage.googleapis.com/is-now-illegal.appspot.com/gifs/` + args1.toUpperCase() + `.gif`;
 if (!args) {
return message.reply(':x: **Please, specify a thing that trump will make illegal**'); }
if (args.length > 1) {
return message.reply(':x: **Max 1 word**'); }
 message.channel.send({ files: [{ attachment: illegal, name: 'isnowillegal.gif' }] })
}
if (message.content.startsWith(prefix + "hug")) {
  let user = message.mentions.users.first();
  let images = ["https://media1.tenor.com/images/b0de026a12e20137a654b5e2e65e2aed/tenor.gif?itemid=7552093", "https://thumbs.gfycat.com/AlienatedUnawareArcherfish-max-1mb.gif", "https://i.imgur.com/6qYOUQF.gif", "https://media.tenor.com/images/ca88f916b116711c60bb23b8eb608694/tenor.gif", "https://m.popkey.co/ccb854/O9eWY.gif", "https://m.popkey.co/32edb3/zE7XE.gif", "https://media1.tenor.com/images/f2805f274471676c96aff2bc9fbedd70/tenor.gif", "https://media1.tenor.com/images/b4ba20e6cb49d8f8bae81d86e45e4dcc/tenor.gif"];
  let randomImage = Math.floor(Math.random() * images.length);
  var hugembed = new Discord.RichEmbed()
  .setColor("#FFFFFF")
  .addField(`Hug :`,`**${message.author.username}** fait un calin à : **${user.username}** 🤗`)
  .setImage(images[randomImage])
  message.channel.send(hugembed)

  }
if(command === "fortnite") {

  let platform;
  let username;
  if (!['pc','xbl','psn'].includes(args[0])) return message.channel.send('**Please Include the platform: `&fortnite [ pc | xbl | psn ] <username>`**');
  if (!args[1]) return message.channel.send('**Please Include the username: `&fortnite [ pc | xbl | psn ] <username>`**');
  
  platform = args.shift(); 
  username = args.join(' '); 
  
  stats.getInfo(username, platform).then( data => {
    
    const embed = new Discord.MessageEmbed() 
      .setColor(0xffffff) 
      .setTitle(`Stats for ${data.username}`) 
      .setDescription(`**Top Placement**\n\n**Top 3:** *${data.lifetimeStats[0].value}*\n**Top 5:** *${data.lifetimeStats[1].value}*\n**Top 6:** *${data.lifetimeStats[3].value}*\n**Top 12:** *${data.lifetimeStats[4].value}*\n**Top 25:** *${data.lifetimeStats[5].value}*`, true) // We can have other information look different, in fields or in the description.
      .setThumbnail('https://vignette.wikia.nocookie.net/fortnite/images/d/d8/Icon_Founders_Badge.png')
      .addField('Total Score', data.lifetimeStats[6].value, true)
      .addField('Matches Played', data.lifetimeStats[7].value, true)
      .addField('Wins', data.lifetimeStats[8].value, true)
      .addField('Win Percentage', data.lifetimeStats[9].value, true)
      .addField('Kills', data.lifetimeStats[10].value, true)
      .addField('K/D Ratio', data.lifetimeStats[11].value, true)
      .addField('Kills Per Minute', data.lifetimeStats[12].value, true)
      .addField('Time Played', data.lifetimeStats[13].value, true)
      .addField('Average Survival Time', data.lifetimeStats[14].value, true)
    
    message.channel.send(embed)
      
  })
  .catch(error => { 
    
    message.channel.send('Username not found!');
  
  })
}
if(command === "lmgtfy") {
	let question = encode(args.join(' ')); 
  let link = `https://www.lmgtfy.com/?q=${question}`;
  message.channel.send(`**<${link}>**`);
  
} 
}
if(command === "anime") {
  message.channel.send(" 🔍 *Searching...* 🔍");
      nani.get('anime/search/' + args).then(function(r) {
        if (r.length == 0 || r == null) {
          bot.reply(msg, "❌ Nothing found ");
          return
        } else {
          nani.get('anime/' + r[0].id).then(function(data) {
            var cleanText = data.description.replace(/<\/?[^>]+(>|$)/g, "");
              var animeEmbed = new Discord.RichEmbed()
              .setDescription(cleanText)
              .addField(`**Names: **`, `${data.title_japanese}, ${data.title_romaji}, ${data.title_english}`)
              .addField("**Type: **", data.type)
              .addField("**Genres: **", data.genres)
              .addField("**Score: **", data.average_score)
              .addField("**Status: **", data.airing_status)
              .addField("**Start Date: **", data.start_date.substr(0, 10))
              .addField("Source", `[AniList](http://anilist.co/anime/${data.id})`)
              .setImage(data.image_url_lge)
              .setColor("RANDOM")
              message.channel.send(animeEmbed);
            })
        }
      }).catch(function(e) {
        console.log(e);
        message.channel.send("❌ Nothing found ");
      });
    }
    if(command === "manga") {
      message.channel.send(" 🔍 *Searching...* 🔍");
      nani.get('manga/search/' + args).then(function(r) {
        if (r.length == 0 || r == null) {
          bot.reply(msg, "❌ Nothing found ");
          return
        } else {
          nani.get('manga/' + r[0].id).then(function(data) {
            var cleanText = data.description.replace(/<\/?[^>]+(>|$)/g, "");
              var mangaEmbed = new Discord.RichEmbed()
              .setDescription(cleanText)
              .addField(`**Names: **`, `${data.title_japanese}, ${data.title_romaji}, ${data.title_english}`)
              .addField("**Type: **", data.type)
              .addField("**Genres: **", data.genres)
              .addField("**Score: **", data.average_score)
              .addField("**Status: **", data.airing_status)
              .addField("**Start Date: **", data.start_date.substr(0, 10))
              .addField("Source", `[AniList](http://anilist.co/manga/${data.id})`)
              .setImage(data.image_url_lge)
              .setColor("RANDOM")
              message.channel.send(mangaEmbed);
            })
        }
      }).catch(function(e) {
        console.log(e);
        message.channel.send("❌ Nothing found ");
      });
    }
    if(command === "server") {
        var data = new Discord.RichEmbed(data)
        data.setColor("RANDOM")
  
        data.setTitle(`${message.guild.name} (${message.guild.id})`)
        data.addField("Members", message.guild.members.array().length, true)
        data.addField("Roles", message.guild.roles.array().length, true)
        data.addField("Region", message.guild.region, true)
        data.addField("Server Created", `${message.guild.createdAt.toDateString()}`, true)
        data.addField("Server Owner", `${message.guild.owner.user.id}>`, true)
        data.addField("Channels", message.guild.channels.array().length, true);
        if (message.guild.iconURL) data.setThumbnail(message.guild.iconURL);
        if (message.guild.emojis.array().length === 0) data.addField("Server Emojis", "None", true);
        else {
          var emojis = []
          var emojis2 = []
          message.guild.emojis.array().map(function(emoje) {
            if (emojis.join(" ").length <= 950) emojis.push(`${emoje}`);
            else (emojis2.push(`${emoje}`))
          })
          data.addField("Server Emojis", emojis.join(" "), true);
          if (emojis2.length > 0) data.addField("", emojis2.join(" "));
        }
        message.channel.sendEmbed(data)
      }
      if(command === "character") {
        message.channel.sendMessage(" 🔍 *Searching...* 🔍");
      nani.get('character/search/' + args).then(function(r) {
        if (r.length == 0 || r == null) {
          message.reply("❌ Nothing found ");
          return
        } else {
          nani.get('character/' + r[0].id).then(function(data) {
            var characterEmbed = new Discord.RichEmbed()
              .addField("**Noms: **", data.name_last + " " + data.name_first + ", " + data.name_alt + ", " + data.name_japanese)
              .addField("**Source: **", `[Anilist](http://anilist.co/character/${data.id})`)
              .setImage(data.image_url_lge)
              .setColor("RANDOM")
              message.channel.send(characterEmbed)
            })
        }
      }).catch(function(e) {
        console.log(e);
        message.channel.send("❌ Nothing found ");
      });
    }
    if(command === "botstats") {
      var seconds = (Math.round(bot.uptime / 1000) % 60)
      var minutes = (Math.round(bot.uptime / (1000 * 60)) % 60)
      var hours = (Math.round(bot
        .uptime / (1000 * 60 * 60)))
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;
  
      var data = new Discord.RichEmbed(data)
      data.setAuthor(message.author.username, message.author.avatarURL)
  
      data.addField("📗 Servers", bot.guilds.size, true)
      data.addField("📃 Channels", bot.channels.size, true)
      data.addField("👤 Users", bot.users.size, true)
      data.addField("🐏 Memory Usage", Math.round(process.memoryUsage().rss / 1024 / 1000) + "MB", true)
      data.addField("Discord.js Version", `**${Discord.version}**`)
      data.addField("⏲️ Uptime", hours + ":" + minutes + ":" + seconds, true)
      data.addField("🖥️ Development Server", "https://discord.gg/jsug8Ey", true)
      data.addField("🔗 Invite Link", "https://discordapp.com/oauth2/authorize?client_id=409287435390812170&scope=bot&permissions=2146954327", true)
      data.setDescription("Si vous avez un question ou avez besoin d'aide, contactez **Mister Smiley#6699**")
      data.setColor("RANDOM")
  
      message.channel.send(data);
    }
    if(command === "puissance4") {
      const m = await message.channel.send("Session started")
      m.react("")
      m.react("")
      m.react("")
      m.react("")
      m.react("")
      m.react("")
      m.react("")
      m.react("")
      m.react("")
      m.react("")
    }
    if(command === "rps") {
    var rps = args.join(" ");
    if (!rps || rps != "rock" && rps != "paper" && rps != "scissors") {
      message.reply("Please enter either rock, paper or scissors");
    } else {
      if (rps == "rock") {
        rps = ":right_facing_fist:"
      } else if (rps == "paper") {
        rps = ":raised_hand:"
      } else if (args == "scissors") {
        rps = ":v:"
      }

      var response = [];
      response.push(":right_facing_fist:");
      response.push(":raised_hand:");
      response.push(":v:");

      var responsenum = Math.floor((Math.random())*3)
      var botJanken = response[responsenum]; 

      var msgArray = [];
      msgArray.push('Player: ' + rps +  '\n     **VS**\nSmileyBot: ' + botJanken);

      if (botJanken == rps) {
        msgArray.push("```fix\nDraw!```");
      }
      else if (rps == ":right_facing_fist:" && botJanken == ":v:" ||
               rps == ":raised_hand:" && botJanken == ":right_facing_fist:" ||
               rps == ":v:" && botJanken == ":raised_hand:") {
        msgArray.push("```diff\n+ You Win!```");
      }
      else if (rps == ":right_facing_fist:" && botJanken == ":raised_hand:" ||
               rps == ":raised_hand:" && botJanken == ":v:" ||
               rps == ":v:" && botJanken == ":right_facing_fist:") {
        msgArray.push("```diff\n- You Lose!```");
      }
      else msgArray.push("```fix\nSomething went wrong! Try again!```");

      message.channel.send(msgArray); 
    }
  }
  if(command === "play") {
    if (message.guild.voiceConnection) {
      if (message.member.voiceChannel && message.member.voiceChannel.id == message.guild.voiceConnection.channel.id) {
        var regex = new RegExp("https:[/][/]www[.]youtube[.]com[/]watch[?]v[=][a-zA-Z0-9\-_]{11}", "ig")
        var str = regex.exec(args)
        if (str) {
          youtube.getById(str[0].substr(32), function(error, result) {
            if (error) {
              console.log(error);
            }
            else {
              console.log(result)
              var data = new Discord.RichEmbed(data);
              data.setAuthor(message.member.displayName + ' added the following to the queue:')
              data.setTitle('▶️️ Title:     ' + result.items[0].snippet.title)
              data.setThumbnail(result.items[0].snippet.thumbnails.default.url)
              data.setColor("#FF4500")
              data.setDescription("🔗 **URL:** " + str[0])

              message.channel.sendEmbed(data);
              music.addToSongs(bot, message.guild, str[0], message.member, result.items[0])
            }
          })
        } else {
          if (args) {
            youtube.search(args, 2, function(error, result) {
              if (error) {
                console.log(error);
              } else if (result.items.length < 1) {
                msg.channel.sendMessage('```diff\n- Error: You need to give a valid youtube video link E.G. https://www.youtube.com/watch?v=YLO7tCdBVrA or give a search term```');
                return;
              } else {
                var link = 'https://www.youtube.com/watch?v=' + result.items[0].id.videoId

                var data = new Discord.RichEmbed(data);
                data.setAuthor(message.member.displayName + ' added the following to the queue:')
                data.setTitle('▶️️ Title:     ' + result.items[0].snippet.title)
                data.setThumbnail(result.items[0].snippet.thumbnails.default.url)
                data.setColor("#FF4500")
                data.setDescription("🔗 **URL:** " + link)

                message.channel.sendEmbed(data)
                music.addToSongs(bot, message.guild, link, message.member, result.items[0])
              }
            })
          } else {
            message.channel.send('```diff\n- Error: You need to give a valid youtube video link E.G. https://www.youtube.com/watch?v=YLO7tCdBVrA or give a search term```');
          }
        }
      } else {
        message.channel.send('```diff\n- Error: You need to join the voice channel the bot is in first```');
      }
    } else {
      message.channel.send('```diff\n- Error: I need to be added to a voice channel before I can play music```');
    }
  }
  if(command === "joinvoice") {
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join().then(connection => {
        music.addToGuildArray(bot, message.guild)
        message.channel.send('I have successfully connected to the ``' + connection.channel.name + '`` voice channel.');
      })
    } else {
      message.channel.send('```diff\n- Error: You need to join a voice channel first```');
    }
}
if(command === "leavevoice") {
  if (message.guild.voiceConnection) {
    music.removeFromGuildArray(bot, msg.guild)
    message.guild.voiceConnection.channel.leave()
    message.channel.send('Disconnected from the ``' + message.guild.voiceConnection.channel.name + '`` voice channel.');
  }
}
if(command === "volume") {
  if (message.guild.voiceConnection) {
    var vol = parseFloat(args)
    if (vol && vol > 0 && vol < 350) {
      music.setVolume(bot, msg.guild, vol)
      message.channel.send('```fix\n- The volume has been set to ' + vol + '%```');
    } else {
      message.channel.send("```diff\n- Error: a number between 1 and 100 was not given; where 40 is average volume```");
    }

  } else {
    message.channel.send("```diff\n- Error: I'm not playing any music```");
  }
}
if(command === "skip") {
  if (message.guild.voiceConnection) {
    if (message.member.voiceChannel && message.member.voiceChannel.id == message.guild.voiceConnection.channel.id) {
      music.skipSong(bot, message.guild.voiceConnection.channel, message.member.id, message.channel)
    } else {
      message.channel.send("```diff\n- Error:You aren't listening to the music```");
    }
  } else {
    message.channel.send("```diff\n- Error: I'm not playing any music```");
  }  
}
if(command === "endsong") {
  if (message.guild.voiceConnection) {
    music.endSong(bot, message.guild)
    message.channel.send('```fix\nSong ended...```');
  } else {
    message.channel.send("```diff\n- Error: I'm not playing any music```");
  }
}
if(command === "queue") {
  if (message.guild.voiceConnection) {
    music.getQueue(bot, message.guild, message.channel)
  } else {
    message.channel.send("```diff\n- Error: I'm not playing any music```");
  }
}
if(command === "pause") {
  if (message.guild.voiceConnection) {
    music.pause(bot, message.guild)
  } else {
    message.channel.send("```diff\n- Error: I'm not playing any music```");
  }
}
if(command === "resume") {
  if (message.guild.voiceConnection) {
    music.resume(bot, message.guild)
  } else {
    message.channel.send("```diff\n- Error: I'm not playing any music```");
  }
}
if(command === "dice") {
  var dice = args.join(" ");
  var diceArray = [];
if(!dice || dice != "1" && dice != "2" && dice != "3" && dice != "4" && dice != "5" && dice != "6") {
  message.reply("Please select a number between 1-6")
} else {
  let numberdice = ["1", "2", "3", "4", "5", "6"];
let rollNumber = Math.floor(Math.random() * numberdice.length);
var rolled = numberdice[rollNumber];
        diceArray.push(' :game_die: ``' + dice + '`` rolled and the result was... ``' + rolled + '``:game_die:')
}
if(!dice || dice != rolled) {
  diceArray.push("Defeat... :sob:")
} else {
  diceArray.push("Victory ! :v:")
    }
  }
  message.channel.send(diceArray)
    if(command === "notes") {
      if(notes[message.author.id] === undefined){
        notes[message.author.id] = {
          'notes':[]
        }
      }
      notes[message.author.id].notes[notes[message.author.id].notes.length] = {
        'content':message.cleanContent.split(" ").splice(1).join(" "),
        'time':Date()
      }
      fs.writeFile('./notes.json',JSON.stringify(notes),function(err){
        if(err) return;
        message.channel.send('Added to notes! Type `'+prefix+'mynotes` to see all your notes')
      })
    } 
    if(command === "mynotes"){
      var nutes = 'Here are your notes:\n\n```'
      for(var i = 0;i < notes[message.author.id].notes.length;i++){
        nutes += `${i + 1}) '${notes[message.author.id].notes[i].content}' - Added ${notes[message.author.id].notes[i].time}\n`
      }
  
      nutes += "```"
      message.channel.send(nutes)
    }
    if (command === "reminder") {
      try {
        let c = message.content.substring(message.content.indexOf(' ') + 1, message.content.length)
        let msg = c.split(" ").splice(1).join(" ").split("|")
        msg[0] = msg[0].replace(/\s/g, '')
        let time = parseTime(msg[0])
        let reminder = msg[1].trim()
        message.reply("I will PM you a reminder to " + reminder + " in " + time + "!")
        setTimeout(function() {
          message.author.send(message.author + " \nReminder: " + reminder)
        }, time.countdown)
  
        function parseTime(str) {
          let num, time
          if (str.indexOf(" ") > -1) {
            num = str.substring(0, str.indexOf(" "))
            time = str.substring(str.indexOf(" ") + 1).toLowerCase()
          } else {
            for (let i = 0; i < str.length; i++) {
              if (str.substring(0, i) && !isNaN(str.substring(0, i)) && isNaN(str.substring(0, i + 1))) {
                num = str.substring(0, i)
                time = str.substring(i)
                break
              }
            }
          }
          if (!num || isNaN(num) || num < 1 || !time || ["d", "day", "days", "h", "hr", "hrs", "hour", "hours", "m", "min", "mins", "minute", "minutes", "s", "sec", "secs", "second", "seconds"].indexOf(time) == -1) {
            return
          }
          let countdown = 0
          switch (time) {
            case "d":
            case "day":
            case "days":
              countdown = num * 86400000
              break
            case "h":
            case "hr":
            case "hrs":
            case "hour":
            case "hours":
              countdown = num * 3600000
              break
            case "m":
            case "min":
            case "mins":
            case "minute":
            case "minutes":
              countdown = num * 60000
              break
            case "s":
            case "sec":
            case "secs":
            case "second":
            case "seconds":
              countdown = num * 1000
              break
          }
          return {
            num: num,
            time: time,
            countdown: countdown
          }
        }
      } catch (err) {
        message.channel.sendMessage("Invalid arguments.")
      }
    }
    if (command === "serverblacklist") {
      if (message.sender.id === config.owner_id) {
        let c = message.content.split(" ").splice(1).join(" ")
        let args = c.split(" ")
        console.log("[DEVELOPER DEBUG] Blacklist args were: " + args)
        if (args[0] === "remove") {
          sbl.splice(sbl.indexOf(args[1]))
          fs.writeFile("./data/blservers.json", JSON.stringify(sbl))
        } else if (args[0] === "add") {
          sbl.push(args[1])
          fs.writeFile("./data/blservers.json", JSON.stringify(sbl))
        } else {
          message.channel.send(`You need to specify what to do! ${prefix}serverblacklist <add/remove> <server id>`)
        }
      } else {
        message.channel.send("Sorry, this command is for the owner only.")
      }
  
    }
    if (command === "userblacklist") {
      if (message.author.id === config.owner_id) {
        let c = message.content.split(" ").splice(1).join(" ")
        let args = c.split(" ")
        console.log("[DEVELOPER DEBUG] Blacklist args were: " + args)
        if (args[0] === "remove") {
          ubl.splice(ubl.indexOf(args[1]))
          fs.writeFile("./data/blusers.json", JSON.stringify(ubl))
        } else if (args[0] === "add") {
          ubl.push(args[1])
          fs.writeFile("./data/blusers.json", JSON.stringify(sbl))
        } else {
          bot.sendMessage(message, `You need to specify what to do! ${prefix}userblacklist <add/remove> <user id>`)
        }
      } else {
        bot.sendMessage(message, "Sorry, this command is for the owner only.")
      }
  
    }
    if(command === "warn") {
      if (message.channel.permissionsOf(message.author).hasPermission("kickMembers") || message.channel.permissionsOf(message.author).hasPermission("banMembers")) {
        let c = message.content
        let usr = message.mentions[0]
        if(!usr) return bot.sendMessage(message, "You need to mention the user");
        let rsn = c.split(" ").splice(1).join(" ").replace(usr, "").replace("<@!" + usr.id + ">", "")
        let caseid = genToken(20)
  
        function genToken(length) {
          let key = ""
          let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  
          for (let i = 0; i < length; i++) {
            key += possible.charAt(Math.floor(Math.random() * possible.length))
          }
  
          return key
        }
  
        warns[caseid] = {
          "admin": {
            "name": message.sender.name,
            "discrim": message.sender.discriminator,
            "id": message.sender.id
          },
          "user": {
            "name": usr.name,
            "discrim": usr.discrim,
            "id": usr.id
          },
          "server": {
            "name": message.channel.server.name,
            "id": message.channel.server.id,
            "channel": message.channel.name,
            "channel_id": message.channel.id
          },
          "reason": rsn
        }
        bot.sendMessage(message, usr + " was warned for `" + rsn + "`, check logs for more info")
        fs.writeFile("./data/warns.json", JSON.stringify(warns))
      } else {
        bot.sendMessage(message, "You have to be able to kick/ban members to use this command")
      }  
    }
    if(command === "lookupwarns") {
       let user = message.mentions[0];
        if(!user) return message.channel.send("You need to mention the user");
        let list = Object.keys(warns);
        let found = '';
        let foundCounter = 0;
        let warnCase;
        for(let i = 0; i < list.length; i++){
            if(warns[list[i]].user.id == user.id){
                foundCounter++;
                found += `${(foundCounter)}. Username: ${warns[list[i]].user.name}\nAdmin: ${warns[list[i]].admin.name}\nServer: ${warns[list[i]].server.name}\nReason: ${warns[list[i]].reason}\n`;
            }
        }
        if(foundCounter == 0) return message.channel.send('Nothing found for this user');
        message.channel.send(`Found ${foundCounter} warns\n ${found}`);
    }
    if(command === "clearwarns") {
      if (message.channel.permissionsOf(message.author).hasPermission("kickMembers") || message.channel.permissionsOf(message.author).hasPermission("banMembers") || message.server.owner.id == message.author.id || message.author.id == config.owner_id || config.admins.indexOf(message.author.id) != -1) {
        let user = message.mentions[0];
        if(!user) return message.channel.send("You need to mention the user");
        let list = Object.keys(warns);
        let found;
        for(let i = 0; i < list.length; i++){
            if(warns[list[i]].user.id == user.id){
                found = list[i];
                break;
            }
        }
        if(!found) return bot.sendMessage(message, 'Nothing found for this user');
        bot.sendMessage(message, `Delete the case of ${warns[found].user.name}\nReason: ${warns[found].reason}`);
        delete warns[found];
        fs.writeFile("./data/warns.json", JSON.stringify(warns))
    }else{
        message.channel.send("You have to be able to kick/ban members to use this command")
    }
    }
	if(command === "tempmute") {
      if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("No can do.");
      if(args[0] == "help"){
        message.reply("Usage: &tempmute <user> <1s/m/h/d>");
        return;
      }
      let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if(!tomute) return message.reply("Couldn't find user.");
      if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
      let reason = args.slice(2).join(" ");
      if(!reason) return message.reply("Please supply a reason.");
    
      let muterole = message.guild.roles.find(`name`, "muted");
      if(!muterole){
        try{
          muterole = await message.guild.createRole({
            name: "muted",
            color: "#000000",
            permissions:[]
          })
          message.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(muterole, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false
            });
          });
        }catch(e){
          console.log(e.stack);
        }
      }
      let mutetime = args[1];
      if(!mutetime) return message.reply("You didn't specify a time!");
    
      message.delete().catch(O_o=>{});
    
      try{
        await tomute.send(`Hi! You've been muted for ${mutetime}. Sorry!`)
      }catch(e){
        message.channel.send(`A user has been muted... but their DMs are locked. They will be muted for ${mutetime}`)
      }
    
      let muteembed = new Discord.RichEmbed()
      .setDescription(`Mute executed by ${message.author}`)
      .setColor("RANDOM")
      .addField("Muted User", tomute)
      .addField("Muted in", message.channel)
      .addField("Time", message.createdAt)
      .addField("Length", mutetime)
      .addField("Reason", reason);
    
      let incidentschannel = message.guild.channels.find(`name`, "log");
      if(!incidentschannel) return message.reply("Please create a incidents channel first!");
      incidentschannel.send(muteembed);
    
      await(tomute.addRole(muterole.id));
    
      setTimeout(function(){
        tomute.removeRole(muterole.id);
        message.channel.send(`<@${tomute.id}> has been unmuted!`);
      }, ms(mutetime));
    }
    if(command === "npm") {
    let embed = new Discord.RichEmbed()
    if (args[0]) {
      npmapi.getdetails(args.join('-'), data => {
        if (data.name) {
          embed.setColor("#c20d0d");
          embed.setAuthor(data.name, 'https://i.imgur.com/24yrZxG.png', 'https://www.npmjs.com/package/' + data.name);
          embed.setThumbnail("https://i.imgur.com/24yrZxG.png")
          embed.addField(`**${data.name} info's**`, "**Description :** \n\n"+data.description+"\n\n**Lien :**\n\nhttps://www.npmjs.com/package/"+data.name+"\n\n**Keywords :** \n\n"+data.keywords+"\n\n**Installation :** \n\n`npm install --save "+data.name+"`\n\n**Repository :** \n\n"+data.homepage+"\n\n**Auteur :**\n\n"+data.author.name+" \n\n**Mail :** "+data.author.email)
        } else {
          embed.setColor("#c20d0d");
          embed.setTitle("Package not found");
          embed.setDescription(`Package not found`);
        }
        message.channel.send({embed});
      });
    } else {
      embed.setColor("#c20d0d");
      embed.setTitle("Package not found");
      embed.setDescription(`Package not found`);
      message.channel.send({embed});
    }
  }
  if(command === "pokedex") {
    P.getPokemonByName(args.join(' ')) 
        .then(function(response) {
            let abilities = [];
            for(i in response.abilities) { abilities.push(response.abilities[i].ability.name) }
            abilitiesString = abilities.join(', ')
            let types = [];
            for(i in response.types) {
              types.push(response.types[i].type.name)
            }
            let typesString = types.join(', ')
            let moves = [];
            for(i in response.moves) {
              if(i < 20)
                  moves.push(response.moves[i].move.name);
            }
            let movesString = moves.join(', ')
            
            message.channel.sendEmbed(new Discord.RichEmbed()
              .setTitle(`Info about ${response.name}`)
              .addField(`Species:`, `${response.species.name}`, true)
              .addField(`Height:`, `${response.height}`, true)
              .addField(`Weight:`, `${response.weight}`, true)
              .addField(`ID:`, `${response.id}`, true)
              .addField(`Type(s):`, `${typesString}`, true)
              .addField(`Move(s) (Top 20):`, `${movesString}`, true)
              .addField(`Abilitie(s):`, `${abilitiesString}`, true)
              .setThumbnail(response.sprites.front_default)
              .setColor("#c20d0d")
            );
    })
    .catch(function(error) {
      message.channel.sendEmbed(new Discord.RichEmbed()
        .addField('Error!', `There was an error! Please make sure that you're inputting an valid pokemon`)
        .setColor(0xff5454)
      );
    });
  }
  if(command === "triggered") {
    if(message.mentions.users.size < 1) {
      Jimp.read(message.author.avatarURL).then(function (photo) {
          photo.resize(512, 512)
          Jimp.read('./img/trigger.png').then(function (lenna) {
              photo.composite(lenna,0,0)
              photo.getBuffer(Jimp.MIME_PNG, function (err, image) { message.channel.send({files:[{attachment:image,name:"file.png"}]}) })
          })
      })
  } else if (message.mentions.users.size > 1) {
      message.channel.sendEmbed(new Discord.RichEmbed()
          .addField('Error!', `Please mention a single user!`)
          .setColor("#c20d0d")
      );
      return;
  } else {
      let mention = message.guild.member(message.mentions.users.first());
      Jimp.read(mention.user.avatarURL).then(function (photo) {
          photo.resize(512, 512)
          Jimp.read('./img/trigger.png').then(function (lenna) {
              photo.composite(lenna,0,0)
              photo.getBuffer(Jimp.MIME_PNG, function (err, image) { message.channel.send({files:[{attachment:image,name:"file.png"}]}) })
          })
      })
  }
  }
  if(command === "test") {
    if(message.content.startsWith(prefix + "triggered")) { 
      var image = message.author.avatarURL; 
      message.channel.send({ file: { attachment: "http://www.triggered-api.tk/api/v1/url=" + image, name: "triggered.gif" 
      }}) 
      }
  }
  if(command === "wasted") {
    let msg = await message.channel.send('Generating...')
    if(message.mentions.users.size < 1) {
        Jimp.read(message.author.avatarURL).then(function (photo) {
            photo.resize(512, 512).grayscale().gaussian(2)
            Jimp.read('./img/wasted.png').then(function (lenna) {
                photo.composite(lenna,0,0)
                photo.getBuffer(Jimp.MIME_PNG, function (err, image) { 
                    msg.delete();
                    message.channel.send({files:[{attachment:image,name:"file.png"}]}) 
                })
            })
        })
    } else if (message.mentions.users.size > 1) {
        message.channel.sendEmbed(new Discord.RichEmbed()
            .addField('Error!', `Please mention a single user!`)
            .setColor("#c20d0d")
        );
        return;
    } else {
        let mention = message.guild.member(message.mentions.users.first());
        Jimp.read(mention.user.avatarURL).then(function (photo) {
            photo.resize(512, 512).grayscale().gaussian(2)
            Jimp.read('./img/wasted.png').then(function (lenna) {
                photo.composite(lenna,0,0)
                photo.getBuffer(Jimp.MIME_PNG, function (err, image) { 
                    msg.delete();
                    message.channel.send({files:[{attachment:image,name:"file.png"}]}) 
                })
            })
        })
    }
  }
  if(command === "jail") {
    let msg = await message.channel.send('Generating...')
    if(message.mentions.users.size < 1) {
        Jimp.read(message.author.avatarURL).then(function (photo) {
            photo.resize(512, 512).grayscale()
            Jimp.read('./img/jail.png').then(function (lenna) {
                photo.composite(lenna,0,0)
                photo.getBuffer(Jimp.MIME_PNG, function (err, image) { 
                    msg.delete();
                    message.channel.send({files:[{attachment:image,name:"file.png"}]}) 
                })
            })
        })
    } else if (message.mentions.users.size > 1) {
        message.channel.sendEmbed(new Discord.RichEmbed()
            .addField('Error!', `Please mention a single user!`)
            .setColor("#c20d0d")
        );
        return;
    } else {
        let mention = message.guild.member(message.mentions.users.first());
        Jimp.read(mention.user.avatarURL).then(function (photo) {
            photo.resize(512, 512).grayscale();
            Jimp.read('./img/jail.png').then(function (lenna) {
                photo.composite(lenna,0,0)
                photo.getBuffer(Jimp.MIME_PNG, function (err, image) { message.channel.send({files:[{attachment:image,name:"file.png"}]}) })
            })
        })
    }
  }
  if(command === "reverse") {
    if(args.length < 1) {
      message.channel.sendEmbed(new Discord.RichEmbed()
          .addField('Error!', `Please give me an string to reverse!`)
          .setColor("#c20d0d")
      );
      return;
  }
  let reverse = args.join(' ').split('').reverse().join('');
  message.channel.send(reverse);
  }
  if(command === "urban") {
    var write = 0;
    var urban = require('urban'),
        word = urban(args.join(' '));
    word.first(function(json) {
        if(json.definition.length < 1) return message.channel.send('Something went wrong...\n errcode: 0');
        if(!json.example) return message.channel.send('Something went wrong...\n errcode: 1');
        if(!json.author) return message.channel.send('Something went wrong...\n errcode: 2');
        if(!json.thumbs_up) return message.channel.send('Something went wrong...\nerr code: 3');
        if(!json.thumbs_down) return message.channel.send('Something went wrong...\nerr code: 4');
        message.channel.sendEmbed(new Discord.RichEmbed()
            .addField(`Definition of ${json.word}`, `${json.definition}`, true)
            .addField(`Example`, `${json.example}`, true)
            .addField(`Author`, `${json.author}`, true)
            .addField(`Rating`, `:thumbsup: ${json.thumbs_up} :thumbsdown: ${json.thumbs_down}`, true)
            .setColor("#c20d0d")
        );
    });
  }
  if(command === "yesno") {
    request('https://yesno.wtf/api/', function(err, resp, body) {
        let data = JSON.parse(body)
        message.channel.sendEmbed(new Discord.RichEmbed()
            .setImage(data.image)
            .setColor("#c20d0d")
        );
    })
  }
  if(command === "math") {
    var result
    let args2 = message.content.split(" ").slice(1).join(" ");
    
    try {
            result = thing.eval(args2)
        } catch (error) {
            console.log('Failed math calculation ' + args2 + '\nError: ' + error.stack)
            message.channel.sendEmbed(new Discord.RichEmbed()
                .addField('Error!', `Failed Calculation`)
                .setColor(0xff5454)
            );
            return;
            
        } finally {
            if (isNaN(parseFloat(result))) {
            message.channel.sendEmbed(new Discord.RichEmbed()
                .addField('Error!', `Calculation Error`)
                .setColor(0xff5454)
            );
            return;
        } else {
            message.channel.sendEmbed(new Discord.RichEmbed()
                .addField('Input:', `\`\`\`${args2}\`\`\``)
                .addField('Answer:', `\`\`\`${result}\`\`\``)
                .setColor(0x5697ff)
            );
            }
        }
  }
  if(command === "botinfo") {
    let member = message.mentions.members.first()
      let botid = member.user.id
        request('https://discordbots.org/api/bots/' + botid, (e, r, b)=> {
          let contenu = JSON.parse(b)
        if(contenu.error === "Not found")  {
          message.channel.send("Ceci n'est pas un bot ou il n'est pas encore approuvé");
        } else {
        const embed = new Discord.RichEmbed()
          embed.setTitle(contenu.username)
          embed.setColor("#c20d0d")
          embed.setFooter("Fait avec l'API discordbots.org");
          embed.setTimestamp()
          embed.addField("Description", contenu.shortdesc)
          embed.addField("Certification", contenu.certifiedBot === true ? "Oui ✅" : "Non ❎")
          embed.addField("Nombres de serveurs", contenu.server_count)
          embed.addField("Librairie utilisé", contenu.lib)
          embed.addField("Ajouté le", contenu.date)
          embed.addField("Prefix", contenu.prefix)
          embed.addField("Liens", "[Invitation](" + contenu.invite + ")\n[DBL.org](https://discordbots.org/bot/" + botid + " )\n[Github](" + contenu.github + ")\n[Website](" + contenu.website + ")")
          embed.addField("Votes", contenu.points)
          message.channel.send({embed});
        }
        })
  }
});

