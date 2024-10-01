interface EpitypesObject {
    wordingEn: string,
    wordingFr: string,
    controlGap: number,
}

interface EpitypesQuery {
    wordingEn ?: string | null,
    wordingFr ?: string | null,
    controlGap ?: number | null,
}



/* SQL

CREATE TABLE `EPITypes` (
	`wordingEn` VARCHAR(25) NOT NULL,
	`wordingFr` VARCHAR(25) NOT NULL,
	`controlGap` INT NOT NULL,
	PRIMARY KEY (`wordingEn`),
);

*/