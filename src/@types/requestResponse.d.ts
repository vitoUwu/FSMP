export interface OnlineServerResponse {
	ip: string;
	port: number;
	debug: Debug;
	motd: Motd;
	players: Players;
	version: string;
	online: true;
	protocol: number | undefined;
	software: string | undefined;
	hostname: string | undefined;
	icon: string | undefined;
}

interface OfflineServerResponse {
	online: false;
	ip: string | undefined;
	port: number | undefined;
	debug: Debug;
	hostname: string | undefined;
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
	list: string[] | undefined;
	uuid: Uuid | undefined;
}

interface Uuid {
	EtInArcadiaEgo: string;
	kasinao69: string;
	Katlinta: string;
}
