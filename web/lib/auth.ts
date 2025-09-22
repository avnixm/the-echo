import bcrypt from "bcrypt";
import { SignJWT, jwtVerify, JWTPayload } from "jose";

const encoder = new TextEncoder();

function getSecret() {
	const secret = process.env.JWT_SECRET;
	if (!secret || secret.length < 32) {
		throw new Error("JWT_SECRET missing or too short (min 32 chars)");
	}
	return secret;
}

export async function hashPassword(plain: string) {
	return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string) {
	return bcrypt.compare(plain, hash);
}

export type SessionTokenPayload = JWTPayload & {
	userId: number;
	role: "admin" | "journalist";
	name: string;
	email: string;
};

export async function createSessionToken(payload: SessionTokenPayload, expiresInSeconds: number) {
	const secret = encoder.encode(getSecret());
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(expiresInSeconds + "s")
		.sign(secret);
}

export async function verifySessionToken(token: string) {
	const secret = encoder.encode(getSecret());
	const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
	return payload as SessionTokenPayload;
}


