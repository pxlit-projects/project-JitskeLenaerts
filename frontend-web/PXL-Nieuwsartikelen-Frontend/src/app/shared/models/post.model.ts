import { State } from './state.enum';

export class Post {
  id: number;
  title: string;
  author: string;
  authorId: number;
  content: string;
  category: string;
  state: State;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    title: string,
    author: string,
    authorId: number,
    content: string,
    category: string,
    state: State,
    createdAt: string,
    updatedAt: string
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.authorId = authorId;
    this.content = content;
    this.category = category;
    this.state = state;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
  }
}
