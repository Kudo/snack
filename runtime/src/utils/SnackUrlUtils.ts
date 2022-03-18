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

const channelRegex = /(\+|\/sdk\..*-)(.*$)/;
export function extractChannelFromSnackUrl(url: string): string | null {
  const matches = url.match(channelRegex);
  return matches ? matches[2] : null;
}

const snackPrefix = '@snack/';
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
    const snackDomain = snackDomains.find(domain => urlString.startsWith(domain));
    if (!snackDomain) {
      return null;
    }

    const pathWithoutSlash = urlString.substring(snackDomain.length);

    let identifier = pathWithoutSlash;
    if (identifier.includes('+')) { // check for a channel id
      identifier = identifier.split('+')[0]
    }
    if (identifier.startsWith(snackPrefix)) {
      identifier = identifier.slice(snackPrefix.length)
    }
    return identifier;
  } catch {
    return null;
  }
}

export function createSnackUrlFromHashId(hashId: string): string {
  return `https://exp.host/@snack/${hashId}`;
}
