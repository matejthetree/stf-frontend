export let activeToken = 'default';

export function updateToken(token:string) : void {
	activeToken = token;
}

export function verifyToken(token:string) : boolean {
	return activeToken == token || 'default' == token
}