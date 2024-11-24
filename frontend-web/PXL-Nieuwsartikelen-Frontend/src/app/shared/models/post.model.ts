export class Post{
  id?: number;
  title: string;
  author: string;
  content: string;
  category: string;
  isConcept: boolean;

  constructor(title: string,author: string,content: string,category: string,isConcept: boolean) {
    this.title = title;
    this.author= author;
    this.content = content;
    this.category = category;
    this.isConcept = isConcept;
  }
}
