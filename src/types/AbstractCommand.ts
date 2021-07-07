import type {
	Application,
	ApplicationCommandOption,
	ApplicationCommandOptionType
} from "discord.js";
// TODO: test choices with all parameter types (except sub command/sub command todo)

export abstract class AbstractCommand {


	public async execute(/* guild state,  interaction: CommandInteraction */): Promise<void> {
		// interaction.
	}

	protected abstract executeImpl(): void;
}

type Snowflake = Application["id"];

interface CommandOptionTypeMapping {
	STRING: string;
	INTEGER: number;
	BOOLEAN: boolean;
	USER: Snowflake;
	CHANNEL: Snowflake;
	ROLE: Snowflake;
	MENTIONABLE: Snowflake;
	SUB_COMMAND: CommandOption<Exclude<ApplicationCommandOptionType, "SUB_COMMAND" | "SUB_COMMAND_GROUP">>;
	SUB_COMMAND_GROUP: CommandOption<"SUB_COMMAND">;
}

type CommandOption<Type extends ApplicationCommandOptionType> = {
	name: ApplicationCommandOption["name"];
	description: ApplicationCommandOption["description"];
	type: Type;
} & (Type extends "SUB_COMMAND" | "SUB_COMMAND_GROUP"
	? { options: CommandOptionTypeMapping[Type][] }
	: { required?: boolean; choices?: CommandOptionTypeMapping[Type][] });

type DefaultCommandOptionsType =
	| (CommandOption<"SUB_COMMAND"> | CommandOption<"SUB_COMMAND_GROUP">)[]
	| CommandOption<Exclude<ApplicationCommandOptionType, "SUB_COMMAND" | "SUB_COMMAND_GROUP">>[];

interface Command<Options extends DefaultCommandOptionsType> {
	name: string;
	description: string;
	options: Options;
}

declare function f<T extends DefaultCommandOptionsType>(x: Command<T>): void;

f({
	name: "permissions",
	description: "Get or edit permissions for a user or a role",
	options: [
		{
			name: "user",
			description: "Get or edit permissions for a user",
			type: "SUB_COMMAND_GROUP",
			options: [
				{
					name: "get",
					description: "Get permissions for a user",
					type: "SUB_COMMAND",
					options: [
						{
							name: "user",
							description: "The user to get",
							type: "USER",
							required: true,
						},
						{
							name: "channel",
							description: "asdasd",
							type: "CHANNEL",
							required: false,
						},
					],
				},
				{
					name: "edit",
					description: "Edit permissions for a user",
					type: "SUB_COMMAND",
					options: [
						{
							name: "user",
							description: "The user to get",
							type: "USER",
							required: true,
						},
						{
							name: "channel",
							description: "asdasd",
							type: "CHANNEL",
						},
					],
				},
			],
		},
		{
			name: "role",
			description: "Get or edit permissions for a role",
			type: "SUB_COMMAND_GROUP",
			options: [
				{
					name: "get",
					description: "Get permissions for a role",
					type: "SUB_COMMAND",
					options: [
						{
							name: "user",
							description: "The user to get",
							type: "USER",
							required: true,
						},
						{
							name: "channel",
							description: "asdasd",
							type: "CHANNEL",
							required: false,
						},
					],
				},
				{
					name: "edit",
					description: "Edit permissions for a role",
					type: "SUB_COMMAND",
					options: [
						{
							name: "user",
							description: "The user to get",
							type: "USER",
							required: true,
						},
						{
							name: "channel",
							description: "asdasd",
							type: "CHANNEL",
							required: false,
						},
					],
				},
			],
		},
		{
			name: "user",
			description: "asd",
			type: "SUB_COMMAND",
			options: [
				{
					name: "asd",
					description: "def",
					type: "BOOLEAN",
				},
			],
		},
	],
});
