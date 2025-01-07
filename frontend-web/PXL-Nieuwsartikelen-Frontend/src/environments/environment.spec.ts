import { environment } from "./environment";

describe('Environment', () => {
  it('should have the correct apiUrl', () => {
    expect(environment.apiUrl).toBe('http://localhost:8085/');
  });
});
