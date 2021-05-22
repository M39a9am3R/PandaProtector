import { MessageEmbed } from "discord.js";
import type { Command } from "../command";

const command: Command = {
	name: "report",
	description: "Report a user to staff.",
	options: [
		{
			type: "USER",
			name: "user",
			description: "The user to report.",
			required: true,
		},
		{
			type: "STRING",
			name: "reason",
			description: "The reason for the report.",
			required: true,
		},
	],
	hasPermission: () => true,
	shouldBeEphemeral: () => true,
	handler: (state, interaction, args) => {
		const reasonText = args[1].value as string;
		//args[0] -- USER option, comes in as string of user id.
		const userObject = state.client.users.cache.get(args[0].value as string);
		const reportChannel = state.client.channels.cache.get(state.config.reportChannelId);

		if (!reportChannel?.isText()) {
			// Ensure the report channel is a text channel.
			console.error("Report channel does not exist or is not a text channel.");
			return;
		}

		if (!userObject || userObject.bot || userObject.id === interaction.user.id) {
			// Ensure the target user is reportable and not the reporter.
			interaction
				.reply("Could not report this user.", { ephemeral: command.shouldBeEphemeral(state, interaction) })
				.catch(console.error.bind(console));
			return;
		}

		if (!interaction.channel?.isText()) {
			// Ensure the interaction channel is a text channel.
			return;
		}

		interaction.channel
			.send("Report created.")
			.then(message => {
				reportChannel
					.send(
						new MessageEmbed({
							fields: [
								{
									name: "Reporter",
									value: `<@${interaction.user.id}>`,
									inline: true,
								},
								{
									name: "Accused",
									value: `<@${userObject.id}>`,
									inline: true,
								},
								{
									name: "Jump Link",
									value: `[Here](${message.url})`,
									inline: true,
								},
								{
									name: "Reason",
									value: reasonText,
								},
							],
							timestamp: interaction.createdTimestamp,
							color: "#FF0000",
						})
					)
					.then(reportMessage => {
						interaction
							.reply(`You have reported the user.`, {
								ephemeral: command.shouldBeEphemeral(state, interaction),
							})
							.catch(console.error.bind(console));
						reportMessage.react("👀").catch(console.error.bind(console));
						reportMessage.react("✅").catch(console.error.bind(console));
						reportMessage.react("❌").catch(console.error.bind(console));
					})
					.catch(reason => {
						console.error(`Reporting ${userObject.username} with reason ${reasonText} failed.`);
						console.error(reason);

						interaction
							.reply(`Could not report the user, please mention an online mod.`, {
								ephemeral: command.shouldBeEphemeral(state, interaction),
							})
							.catch(console.error.bind(console));
					});
			})
			.catch(console.error.bind(console));
	},
};

export default command;
