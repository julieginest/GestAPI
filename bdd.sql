CREATE TABLE `EPITypes` (
	`wordingEn` VARCHAR(25) NOT NULL,
	`wordingFr` VARCHAR(25) NOT NULL,
	`controlGap` INT NOT NULL,
	PRIMARY KEY (`wordingEn`)
);
CREATE TABLE `EPIStatus` (
	`wording` VARCHAR(10) NOT NULL,
	`isUsable` BOOLEAN NOT NULL DEFAULT 0,
	PRIMARY KEY (`wording`)
);
CREATE TABLE `EPIs` (
	`Id` VARCHAR(10) NOT NULL,
	`typeWording` VARCHAR(25) NOT NULL,
	`brand` VARCHAR(25) NOT NULL,
	`model` VARCHAR(25) NOT NULL,
	`serieNo` VARCHAR(25) NOT NULL,
	`size` VARCHAR(3),
	`lenght` INT,
	`color` VARCHAR(10),
	`purchase` DATE,
	`manufacture` DATE,
	`commissioning` DATE,
	PRIMARY KEY (`Id`),
    CONSTRAINT `fk_EPIs-EPITypes` FOREIGN KEY (typeWording) REFERENCES EPITypes (wordingEn)
);
CREATE TABLE `UserTypes` (
    `name` VARCHAR(15),
	PRIMARY KEY (`name`)
);
CREATE TABLE `Users` (
	`Id` VARCHAR(10),
	`firstName` VARCHAR(20),
	`lastName` VARCHAR(20),
    `typeName` VARCHAR(15),
	PRIMARY KEY (`Id`),
    CONSTRAINT `fk_Users-UserTypes` FOREIGN KEY (typeName) REFERENCES UserTypes (name)

);
CREATE TABLE `Controls` (
	`Id` INT NOT NULL AUTO_INCREMENT FIRST,
	`date` DATE NOT NULL,
    `managerId` VARCHAR(10) NOT NULL,
    `epiId` VARCHAR(10) NOT NULL,
    `status` VARCHAR(10),
    `comment` VARCHAR(512),
	PRIMARY KEY (`Id`),
    CONSTRAINT `fk_Controls-Users` FOREIGN KEY (managerId) REFERENCES Users (Id),
    CONSTRAINT `fk_Controls-EPIs` FOREIGN KEY (epiId) REFERENCES EPIs (Id),
    CONSTRAINT `fk_Controls-EPIStatus` FOREIGN KEY (status) REFERENCES EPIStatus (wording)
);