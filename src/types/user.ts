interface UserObject{
    Id: string,
    firstName: string,
    lastName: string,
    typeName: string,
}


interface UserQuery{
    Id ?: string | null,
    firstName ?: string | null,
    lastName ?: string | null,
    typeName ?: string | null,
}

/* SQL

CREATE TABLE `Users` (
	`Id` VARCHAR(10),
	`firstName` VARCHAR(20),
	`lastName` VARCHAR(20),
    `typeName` VARCHAR(15),
	PRIMARY KEY (`Id`),
    CONSTRAINT `fk_Users-UserTypes` FOREIGN KEY (typeName) REFERENCES EPIs (name),

);

*/