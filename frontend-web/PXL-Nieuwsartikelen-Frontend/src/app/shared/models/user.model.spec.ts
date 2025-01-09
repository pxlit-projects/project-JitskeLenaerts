import { User } from './user.model';

describe('User Interface', () => {
  it('should accept a valid User object', () => {
    const user: User = {
      username: 'john_doe',
      id: 123,
      password: 'securePassword123',
      role: 'admin',
      authorName: 'John Doe',
    };

    expect(user.username).toBe('john_doe');
    expect(user.id).toBe(123);
    expect(user.password).toBe('securePassword123');
    expect(user.role).toBe('admin');
    expect(user.authorName).toBe('John Doe');
  });

  it('should check if an object has all required properties for User', () => {
    const incompleteUser = {
      username: 'john_doe',
      id: 123,
      password: 'securePassword123',
      role: 'admin',
    };

    const isValidUser = (obj: any): obj is User => {
      return (
        typeof obj.username === 'string' &&
        typeof obj.id === 'number' &&
        typeof obj.password === 'string' &&
        typeof obj.role === 'string' &&
        typeof obj.authorName === 'string'
      );
    };

    expect(isValidUser(incompleteUser)).toBeFalse();
  });

  it('should handle dynamic validation for runtime data', () => {
    const user = {
      username: 'jane_doe',
      id: 456,
      password: 'anotherSecurePassword',
      role: 'editor',
      authorName: 'Jane Doe',
    };

    const isValidUser = (obj: any): obj is User => {
      return (
        typeof obj.username === 'string' &&
        typeof obj.id === 'number' &&
        typeof obj.password === 'string' &&
        typeof obj.role === 'string' &&
        typeof obj.authorName === 'string'
      );
    };

    expect(isValidUser(user)).toBeTrue();
  });
});
