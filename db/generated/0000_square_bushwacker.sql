CREATE TABLE `todo` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`userId` varchar(191) NOT NULL,
	`text` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`false` boolean
);

CREATE UNIQUE INDEX posts__user_id__idx ON todo (`userId`);