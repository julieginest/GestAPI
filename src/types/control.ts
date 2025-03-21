export interface ControlObject {
    Id: number,
    date: Date,
    managerId: string,
    epiId: string,
    status: string,
    comment: string,
}

export interface ControlCreation {
    date: Date,
    managerId: string,
    epiId: string,
    status: string,
    comment: string,
}

export interface ControlQuery {
    Id ?: number | null,
    date ?: Date | null,
    managerId ?: string | null,
    epiId ?: string | null,
    status ?: string | null,
    comment ?: string | null,
}


const controlSQL: string = `

CREATE TABLE \`Controls\` (
	\`Id\` INT NOT NULL AUTO_INCREMENT FIRST,
	\`date\` DATE NOT NULL,
    \`managerId\` VARCHAR(10) NOT NULL,
    \`epiId\` VARCHAR(10) NOT NULL,
    \`status\` VARCHAR(10),
    \`comment\` VARCHAR(512),
	PRIMARY KEY (\`Id\`),
    CONSTRAINT \`fk_Controls-Users\` FOREIGN KEY (managerId) REFERENCES Users (Id),
    CONSTRAINT \`fk_Controls-EPIs\` FOREIGN KEY (epiId) REFERENCES EPIs (Id),
    CONSTRAINT \`fk_Controls-EPIStatus\` FOREIGN KEY (status) REFERENCES EPIStatus (wording),
);
`