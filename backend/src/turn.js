import crypto from 'node:crypto';
import { config } from './config.js';

const { turn } = config;

/**
 * Credential TURN tạm thời theo chuẩn "TURN REST API" (coturn: --use-auth-secret).
 *   username   = <thời điểm hết hạn (unix)>:<userId>
 *   credential = base64(HMAC-SHA1(TURN_SECRET, username))
 * Khóa dài hạn không bao giờ gửi cho trình duyệt.
 */
export function createCoturnCredentials(userId) {
  const expiresAt = Math.floor(Date.now() / 1000) + turn.ttlSeconds;
  const username = `${expiresAt}:${userId}`;
  const credential = crypto.createHmac('sha1', turn.secret).update(username).digest('base64');
  return { username, credential };
}

/**
 * Trả về cấu hình `iceServers` cho GET /api/v1/calls/ice-servers (openapi).
 */
export async function getIceServers(userId) {
  const iceServers = [{ urls: turn.stunUrls }];

  if (turn.mode === 'coturn') {
    iceServers.push({ urls: turn.urls, ...createCoturnCredentials(userId) });
  } else if (turn.mode === 'metered') {
    // Metered.ca: https://www.metered.ca/docs/turn-rest-api/get-credential-list
    const url = `https://${turn.meteredApp}.metered.live/api/v1/turn/credentials?apiKey=${turn.meteredApiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Metered trả về ${res.status}`);
    iceServers.push(...(await res.json()));
  }

  return { iceServers, ttlSeconds: turn.ttlSeconds };
}