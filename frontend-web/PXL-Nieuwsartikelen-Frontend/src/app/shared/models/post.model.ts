export class Post {
  id?: number;
  title: string;
  author: string;
  content: string;
  category: string;
  concept: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    title: string,
    author: string,
    content: string,
    category: string,
    concept: boolean,
    createdAt: string,
    updatedAt: string
  ) {
    this.title = title;
    this.author = author;
    this.content = content;
    this.category = category;
    this.concept = concept;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
  }
}
