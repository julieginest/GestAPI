interface UsertypeObject {
    name: string,
}


interface UsertypeQuery {
    name ?: string | null,
}

/* SQL

CREATE TABLE `UserTypes` (
    `name` VARCHAR(15),
	PRIMARY KEY (`name`),
)

*/