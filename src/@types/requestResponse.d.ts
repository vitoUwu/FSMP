export interface Response {
	ip: string;
	port: number;
	debug: Debug;
	motd: Motd;
	players: Players;
	version: string;
	online: boolean;
	protocol: number;
	software: string;
}

interface Debug {
	ping: boolean;
	query: boolean;
	srv: boolean;
	querymismatch: boolean;
	ipinsrv: boolean;
	cnameinsrv: boolean;
	animatedmotd: boolean;
	cachetime: number;
	cacheexpire: number;
	apiversion: number;
	error: Error;
}

interface Error {
	query: string;
}

interface Motd {
	raw: string[];
	clean: string[];
	html: string[];
}

interface Players {
	online: number;
	max: number;
	list: string[];
	uuid: Uuid;
}

interface Uuid {
	EtInArcadiaEgo: string;
	kasinao69: string;
	Katlinta: string;
}
