import { fetchCodeBySnackIdentifier } from '../ExpoApiUtils';

describe(fetchCodeBySnackIdentifier, () => {
  let mockedFetch: jest.MockedFunction<typeof fetch>;
  beforeEach(() => {
    mockedFetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    ) as unknown as jest.MockedFunction<typeof fetch>;
    globalThis.fetch = mockedFetch;
  });

  it('should support `@snack/<hashId>` format', async () => {
    await fetchCodeBySnackIdentifier('@snack/foo');
    expect(mockedFetch.mock.calls[0][0]).toBe('https://exp.host/--/api/v2/snack/foo');
  });

  it('should support `@username/<hashId>` format', async () => {
    await fetchCodeBySnackIdentifier('@username/foo');
    expect(mockedFetch.mock.calls[0][0]).toBe('https://exp.host/--/api/v2/snack/@username/foo');
  });
});
