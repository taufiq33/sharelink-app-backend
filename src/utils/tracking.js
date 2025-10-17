import {
  INTERVAL_VALID_TRACK_MS,
  KEEP_CLICK_CACHE_DATA_MS,
  MAX_REQUEST_PER_MINUTE,
} from "../config/app_config.js";

export const clickCacheMap = new Map();

export function isLimit(deviceId) {
  const key = `ratelimit:${deviceId}`;
  const now = Date.now();
  const timestamps = clickCacheMap.get(key) || [];

  const oneMinuteAgo = now - 60 * 1000;

  const timestampsInOneMinute = timestamps.filter(
    (timestamp) => timestamp > oneMinuteAgo
  );

  if (timestampsInOneMinute.length > MAX_REQUEST_PER_MINUTE) {
    return true;
  }

  timestamps.push(now);
  clickCacheMap.set(key, timestamps);
  // console.log(`timestamps all skrng total ${timestamps.length}`);
  // console.log(
  //   `timestamps dalam 1menit skrng total ${timestampsInOneMinute.length}`
  // );
  console.log(clickCacheMap);
  return false;
}

export function isSpam(deviceId, linkId) {
  const key = `${deviceId}:${linkId}`;
  const now = Date.now();
  const timestamp = clickCacheMap.get(key);

  if (timestamp && now - timestamp < INTERVAL_VALID_TRACK_MS) {
    return true;
  }

  clickCacheMap.set(key, now);
  console.log(clickCacheMap);
  return false;
}

export function clearClickCacheAboveFiveMinutes() {
  const now = Date.now();
  const fiveMinutesAgo = now - KEEP_CLICK_CACHE_DATA_MS;
  const beforeCleaning = new Map(clickCacheMap);

  for (const [key, value] of clickCacheMap) {
    if (!value) continue;

    if (typeof value === "number") {
      if (value < fiveMinutesAgo) {
        clickCacheMap.delete(key);
      }
    }

    if (Array.isArray(value)) {
      const newValue = value.filter((ts) => ts > fiveMinutesAgo);
      if (newValue.length === 0) {
        clickCacheMap.delete(key);
      } else if (newValue.length !== value.length) {
        clickCacheMap.set(key, newValue);
      }
    }
  }

  console.log(`
==== Cleaning clickCacheMap ====
Time: ${new Date().toLocaleString()}
Before cleaning: ${JSON.stringify([...beforeCleaning])}
After cleaning : ${JSON.stringify([...clickCacheMap])}
================================
`);
}
