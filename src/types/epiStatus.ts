interface EpistatusObject {
    wording: string,
    isUsable: boolean,
}


interface EpistatusQuery {
    wording ?: string | null,
    isUsable ?: boolean | null,
}

/* SQL

CREATE TABLE `EPIStatus` (
	`wording` VARCHAR(10) NOT NULL,
	`isUsable` BOOLEAN NOT NULL DEFAULT 0,
	PRIMARY KEY (`wording`),
);


*/