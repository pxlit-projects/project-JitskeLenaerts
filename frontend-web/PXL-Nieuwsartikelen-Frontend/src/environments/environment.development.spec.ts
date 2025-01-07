import { environment } from "./environment.development";

describe('Environment', () => {
  it('should have the correct apiUrl', () => {
    expect(environment.apiUrl).toBe('http://localhost:8085/');
  });
});
