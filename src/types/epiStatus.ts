export interface EpistatusObject {
    wording: string,
    isUsable: boolean,
}


export interface EpistatusQuery {
    wording ?: string | null,
    isUsable ?: boolean | null,
}

const EPIStatiusSQL: string = `

CREATE TABLE \`EPIStatus\` (
	\`wording\` VARCHAR(10) NOT NULL,
	\`isUsable\` BOOLEAN NOT NULL DEFAULT 0,
	PRIMARY KEY (\`wording\`),
);
`