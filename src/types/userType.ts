export interface UsertypeObject {
    name: string,
}


export interface UsertypeQuery {
    name ?: string | null,
}

const UserTypesSQL: string = `

CREATE TABLE \`UserTypes\` (
    \`name\` VARCHAR(15),
	PRIMARY KEY (\`name\`),
);
`