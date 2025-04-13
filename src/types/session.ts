export interface SessionObject {
  GUID: string;
  userConcerned: string;
  lastActionDateTime: Date;
  creationDateTime: Date;
}

export interface SessionQuery {
  GUID?: string | null;
  userConcerned?: string | null;
}

export interface SessionCreation {
  userConcerned: string;
}

export interface SessionByUserConcerned {
  userConcerned: string;
}

export interface SessionByGUID {
  GUID: string;
}

export const ProjetSQL: string =`
CREATE TABLE \`sessions\` (
  \`GUID\` char(36) NOT NULL,
  \`userConcerned\` char(36) NOT NULL,
  \`lastActionDateTime\` DATETIME NOT NULL,
  \`creationDateTime\` DATETIME NOT NULL,
  PRIMARY KEY (\`GUID\`),
  KEY \`userConcerned\` (\`userConcerned\`),
  CONSTRAINT \`sessions_ibfk_1\` FOREIGN KEY (\`userConcerned\`) REFERENCES \`Users\` (\`Id\`)
);

SET GLOBAL event_scheduler = ON;

CREATE EVENT delete_expired_sessions
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM sessions
  WHERE \`creationDateTime\` < NOW() - INTERVAL 30 DAY
  AND \`lastActionDateTime\` < NOW() - INTERVAL 5 DAY;
`