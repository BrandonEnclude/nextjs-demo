import { createMocks } from 'node-mocks-http';
import hello from '../pages/api/hello';

describe('/api/hello', () => {
  test('returns a greeting with the given name', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        name: 'Brandon',
      },
    });

    await hello(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        message: 'Hello Brandon',
      }),
    );
  });
});