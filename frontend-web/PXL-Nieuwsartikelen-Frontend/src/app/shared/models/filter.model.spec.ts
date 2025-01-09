import { Filter } from '../models/filter.model';

describe('Filter Interface', () => {
  it('should accept a valid Filter object', () => {
    const filter: Filter = {
      title: 'Test Title',
      author: 'John Doe',
      content: 'This is some test content.',
      category: 'Test Category',
      createdAt: new Date('2025-01-08T10:00:00Z'),
    };

    expect(filter).toBeTruthy();
    expect(filter.title).toBe('Test Title');
    expect(filter.author).toBe('John Doe');
    expect(filter.content).toBe('This is some test content.');
    expect(filter.category).toBe('Test Category');
    expect(filter.createdAt?.toISOString().replace('.000', '')).toBe('2025-01-08T10:00:00Z');
  });

  it('should handle a null createdAt field', () => {
    const filter: Filter = {
      title: 'Another Title',
      author: 'Jane Doe',
      content: 'Another piece of test content.',
      category: 'Another Category',
      createdAt: null,
    };

    expect(filter.createdAt).toBeNull();
  });

  it('should allow empty strings for optional fields', () => {
    const filter: Filter = {
      title: '',
      author: '',
      content: '',
      category: '',
      createdAt: null,
    };

    expect(filter.title).toBe('');
    expect(filter.author).toBe('');
    expect(filter.content).toBe('');
    expect(filter.category).toBe('');
    expect(filter.createdAt).toBeNull();
  });

  it('should correctly handle a fully populated Filter object', () => {
    const createdAt = new Date();
    const filter: Filter = {
      title: 'Comprehensive Title',
      author: 'Sam Smith',
      content: 'Detailed content for testing.',
      category: 'Comprehensive Category',
      createdAt: createdAt,
    };

    expect(filter.title).toBe('Comprehensive Title');
    expect(filter.author).toBe('Sam Smith');
    expect(filter.content).toBe('Detailed content for testing.');
    expect(filter.category).toBe('Comprehensive Category');
    expect(filter.createdAt).toBe(createdAt);
  });
});
