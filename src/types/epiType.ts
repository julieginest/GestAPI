export interface EpitypesObject {
    wordingEn: string,
    wordingFr: string,
    controlGap: number,
}

export interface EpitypesQuery {
    wordingEn ?: string | null,
    wordingFr ?: string | null,
    controlGap ?: number | null,
}



const EPITypesSQL: string = `

CREATE TABLE \`EPITypes\` (
	\`wordingEn\` VARCHAR(25) NOT NULL,
	\`wordingFr\` VARCHAR(25) NOT NULL,
	\`controlGap\` INT NOT NULL,
	PRIMARY KEY (\`wordingEn\`),
);
`