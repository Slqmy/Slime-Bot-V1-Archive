import {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import {ErrorMessageBuilder} from "../../../classes.js";
import embedSchema from "../../../schemas/embedSchema.js";

export default {
	data: {
		name: "embedFieldsRemove",
	},

	async execute(interaction) {
		const embed = interaction.message.embeds[0].data;

		const customID = embed.description.match(/\d+/)[0];

		const embedProfile = await embedSchema.findOne({
			author: interaction.user.id,
			customID: customID,
		});

		if (!embedProfile) {
			return await interaction.reply(
				new ErrorMessageBuilder("This embed does not exist!"),
			);
		}

		await interaction.showModal(
			new ModalBuilder()
				.setCustomId("embedFieldsRemove")
				.setTitle("Delete Field")
				.addComponents(
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setCustomId("deletedField")
							.setLabel("Which field would you like to delete?")
							.setRequired(true)
							.setStyle(TextInputStyle.Short)
							.setPlaceholder("Number of the field to delete."),
					),
				),
		);
	},
};
