-- CreateTable
CREATE TABLE `AccountType` (
    `type` ENUM('Asset', 'Expense', 'Revenue', 'Equity', 'Liability') NOT NULL,

    UNIQUE INDEX `AccountType_type_key`(`type`),
    PRIMARY KEY (`type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,
    `openingBalance` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `maximumAmountOwed` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `builtIn` BOOLEAN NOT NULL DEFAULT false,
    `accountType` ENUM('Asset', 'Expense', 'Revenue', 'Equity', 'Liability') NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Account_name_userId_key`(`name`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_accountType_fkey` FOREIGN KEY (`accountType`) REFERENCES `AccountType`(`type`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
