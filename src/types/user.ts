export interface UserObject{
    Id: string,
    firstName: string,
    lastName: string,
    typeName: string,
    pswd: string
}


export interface UserQuery{
    Id ?: string | null,
    firstName ?: string | null,
    lastName ?: string | null,
    typeName ?: string | null,
    pswd?: string
}

const UserSQL: string = `

CREATE TABLE \`Users\` (
	\`Id\` VARCHAR(10),
	\`firstName\` VARCHAR(20),
	\`lastName\` VARCHAR(20),
    \`typeName\` VARCHAR(15),
	PRIMARY KEY (\`Id\`),
    CONSTRAINT \`fk_Users-UserTypes\` FOREIGN KEY (typeName) REFERENCES EPIs (name),

);
`
