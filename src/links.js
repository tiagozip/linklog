import { linkQueries } from "./db.js";
import {
	generateString,
	generateUniqueId,
	tryAsync,
	validateUrl,
} from "./utils.js";

export const createLink = async ({ url, userIp }) => {
	if (url.length > 1_000) {
		throw new Error("URL too long");
	}

	if (!validateUrl(url)) {
		throw new Error("Invalid URL");
	}

	const id = generateUniqueId((id) => linkQueries.findById.get(id));
	const key = generateString(50);
	const keyHash = await Bun.password.hash(key);

	const spooUrl = await tryAsync(async () => {
		const response = await fetch("https://spoo.me/", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json",
			},
			body: new URLSearchParams({
				url: `${process.env.HOSTNAME}/${id}`,
				alias: "",
				password: "",
				"max-clicks": "",
			}),
		});
		const data = await response.json();
		return data.short_url;
	});

	linkQueries.insert.run(id, keyHash, url, userIp, spooUrl);

	return { slug: id, key };
};

export const getLink = async ({ slug, key }) => {
	const record = linkQueries.findById.get(slug);

	if (!record) {
		throw new Error("Link not found");
	}

	const isValidKey = await Bun.password.verify(key, record.key_hash);
	if (!isValidKey) {
		throw new Error("Invalid key");
	}

	const hits = linkQueries.getHits.all(slug).map((hit) => ({
		...hit,
		ip_data: hit.ip_data ? JSON.parse(hit.ip_data) : null,
	}));

	return {
		url: record.url,
		hits,
		masked: {
			spoodotme: record.spoo_url,
		},
	};
};

export const deleteLink = async ({ slug, key }) => {
	const record = linkQueries.findById.get(slug);

	if (!record) {
		throw new Error("Link not found");
	}

	const isValidKey = await Bun.password.verify(key, record.key_hash);
	if (!isValidKey) {
		throw new Error("Invalid key");
	}

	linkQueries.deleteById.run(slug);

	linkQueries.deleteHitsByLinkId.run(slug);
	return { success: true };
};

export const recordHit = async ({ id, ipData, userIp }) => {
	const record = linkQueries.findById.get(id);

	if (!record) {
		throw new Error("Link not found");
	}

	const geoData = await tryAsync(async () => {
		const response = await fetch(
			`https://tools.keycdn.com/geo.json?host=${userIp}`,
			{
				headers: {
					"User-Agent": `keycdn-tools:${process.env.HOSTNAME}`,
				},
			},
		);
		const data = await response.json();
		return data.data.geo;
	});

	linkQueries.insertHit.run(id, JSON.stringify({ ...ipData, ip: geoData }));

	return { url: record.url };
};

export const editLink = async ({ slug, key, newUrl }) => {
	if (newUrl.length > 1_000) {
		throw new Error("URL too long");
	}

	if (!validateUrl(newUrl)) {
		throw new Error("Invalid URL");
	}

	const record = linkQueries.findById.get(slug);

	if (!record) {
		throw new Error("Link not found");
	}

	const isValidKey = await Bun.password.verify(key, record.key_hash);
	if (!isValidKey) {
		throw new Error("Invalid key");
	}

	linkQueries.updateUrl.run(newUrl, slug);

	return { success: true, url: newUrl };
};

export const deleteMe = async ({ slug, ip }) => {
	const hits = linkQueries.getHits.all(slug);

	if (!hits?.length) {
		return { ok: false };
	}

	const hit = hits.find((hit) => {
		return JSON.parse(hit.ip_data).ip.ip === ip;
	});

	if (!hit?.id) {
		return { ok: false };
	}

	linkQueries.deleteHit.run(hit.id);

	return { ok: true };
};
