/*
 * Supported url types:
 *  - 'https://exp.host/@snack/SAVE_UUID+CHANNEL_UUID'
 *  - 'https://exp.host/@snack/sdk.14.0.0-CHANNEL_UUID'
 *  - 'https://exp.host/@snack/SAVE_UUID'
 *  - 'https://exp.host/@USERNAME/SNACK_SLUG'
 */

export function isValidSnackUrl(url: string): boolean {
  return (
    extractChannelFromSnackUrl(url) !== null || extractSnackIdentifierFromSnackUrl(url) !== null
  );
}

/**
 * Create a full Snack URL based on the snack identifier.
 * The identifier can be 4 formats:
 *   - `@bycedric/my-snack`
 *   - `sdk.44.0.0-CHANNEL_UUID`
 *   - `SAVE_UUID`
 *   - `SAVE_UUID+CHANNEL_UUID`
 */
export function createSnackUrlFromSnackIdentifier(snackIdentifier: string): string {
  return snackIdentifier.startsWith('@')
    ? `https://exp.host/${snackIdentifier}`
    : `https://exp.host/@snack/${snackIdentifier}`;
}

const channelRegex = /(\+|\/sdk\..*-)([^?]*)\??(.*$)/;

/**
 * Check if the Snack URL is bound to a short-lived session.
 * This session is voided whenever the user closes the Snack website or embed.
 */
export function isEphemeralSnackUrl(snackUrl?: string): boolean {
  if (snackUrl == null) {
    return false;
  }
  const matches = snackUrl.match(channelRegex);
  return matches != null && matches[1].length > 1;
}

export function extractChannelFromSnackUrl(url: string): string | null {
  const matches = url.match(channelRegex);
  return matches ? matches[2] : null;
}

const snackDomains = [
  'http://snack.expo.dev/',
  'https://snack.expo.dev/',
  'http://exp.host/',
  'https://exp.host/',
  'exp://exp.host/',
  'exps://exp.host/',
];

export function extractSnackIdentifierFromSnackUrl(urlString: string): string | null {
  try {
    const snackDomain = snackDomains.find((domain) => urlString.startsWith(domain));
    if (!snackDomain) {
      return null;
    }

    const pathWithoutSlash = urlString.substring(snackDomain.length);

    let identifier = pathWithoutSlash;
    if (identifier.includes('+')) {
      // check for a channel id
      identifier = identifier.split('+')[0];
    }
    return identifier;
  } catch {
    return null;
  }
}

export function createSnackUrlFromHashId(hashId: string): string {
  return `https://exp.host/@snack/${hashId}`;
}

export function parseExperienceURL(
  experienceURL: string
): { channel: string; testTransport: string | null } | null {
  const matches = experienceURL.match(channelRegex);
  if (!matches) {
    return null;
  }
  const channel = matches[2];

  let testTransport = null;
  const queryItems = (matches[3] ?? '').split(/&/g);
  for (const item of queryItems) {
    if (item.startsWith('testTransport=')) {
      testTransport = item.substring(14);
      break;
    }
  }
  return {
    channel,
    testTransport,
  };
}
