import embedSchema from "../../../schemas/embedSchema.js";
import {ErrorMessageBuilder} from "../../../classes.js";
import {EmbedBuilder} from "discord.js";
import {checkAuthorisation} from "../../../functions.js";

export default {
	data: {
		name: "embedPreview",
	},
	async execute(interaction) {
		if (!checkAuthorisation(interaction)) {
			return await interaction.reply(
				new ErrorMessageBuilder("This is not your embed!"),
			);
		}
		await interaction.deferReply({ephemeral: true});

		const count =
			interaction.message.embeds[0].data.description.match(/\d+/)[0];

		const embedProfile = await embedSchema.findOne({
			author: interaction.user.id,
			customID: count,
		});

		if (!embedProfile) {
			return await interaction.editReply(
				new ErrorMessageBuilder("This embed does not exist!"),
			);
		}

		if (
			!embedProfile.content &&
			!embedProfile.embeds.length &&
			!embedProfile.files.length &&
			!embedProfile.components.length
		) {
			return await interaction.editReply(
				new ErrorMessageBuilder("Can not send an empty message!"),
			);
		}

		await interaction.editReply({
			content: embedProfile.content,
			embeds: embedProfile.embeds.map((embed) => new EmbedBuilder(embed)),
			files: embedProfile.files.map((file) => file.link),
			components: embedProfile.components,
			ephemeral: true,
		});
	},
};
