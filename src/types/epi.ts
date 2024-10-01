export interface EpiObject {
    Id : string,
    typeWording: string,
    brand: string,
    model: string,
    serieNo: string,
    size: string,
    lenght: number,
    color: string,
    purchase: Date,
    manufacture: Date,
    commissioning: Date,
}

export interface EpiQuery {
    Id ?: string | null,
    typeWording ?: string | null,
    brand ?: string | null,
    model ?: string | null,
    serieNo ?: string | null,
    size ?: string | null,
    lenght ?: number | null,
    color ?: string | null,
    purchase ?: Date | null,
    manufacture ?: Date | null,
    commissioning ?: Date | null,
}

const EPISQL: string = `

CREATE TABLE \`EPIs\` (
	\`Id\` VARCHAR(10) NOT NULL,
	\`typeWording\` VARCHAR(25) NOT NULL,
	\`brand\` VARCHAR(25) NOT NULL,
	\`model\` VARCHAR(25) NOT NULL,
	\`serieNo\` VARCHAR(25) NOT NULL,
	\`size\` VARCHAR(3),
	\`lenght\` INT,
	\`color\` VARCHAR(10),
	\`purchase\` DATE,
	\`manufacture\` DATE,
	\`commissioning\` DATE,
	PRIMARY KEY (\`Id\`),
    CONSTRAINT \`fk_EPIs-EPITypes\` FOREIGN KEY (typeWording) REFERENCES EPITypes (wordingEn),
);
`