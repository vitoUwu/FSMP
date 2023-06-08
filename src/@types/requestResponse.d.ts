export interface OnlineServerResponse {
	status: 'success';
	online: true;
	motd: string;
	error: null;
	favicon: string;
	players: {
		max: number;
		now: number;
		sample: { name: string; id: string }[];
	};
	server: {
		name: string;
		protocol: number;
	};
	last_updated: string;
	duration: string;
}

interface OfflineServerResponse {
	status: string;
	online: false;
	motd: string;
	error: string;
	players: {
		max: number;
		min: number;
		sample: { name: string; id: string }[];
	};
	server: {
		name: null;
		protocol: number;
	};
	last_updated: string;
	duration: string;
}
