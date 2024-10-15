export let activeToken = 'default';
export let lastVerification = false;

export function updateToken(token:string) : void {
	console.log("updating token", token);
	activeToken = token;
	lastVerification = false;
}

export function verifyToken(token:string) : boolean {
	lastVerification = activeToken == token || 'default' == token
	console.log("verifying token", token, activeToken, lastVerification);
	return lastVerification;
}