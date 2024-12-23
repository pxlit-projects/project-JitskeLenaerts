// src/app/shared/models/comment.model.ts
export class Comment {
    id: number;          
    postId: number;
    comment: string;
    author: string;
    authorId: number;
    createdAt: string;   
    updatedAt: string;   
  
    constructor(
      id: number,
      postId: number,
      comment: string,
      author: string,
      authorId: number,
      createdAt: string,
      updatedAt: string
    ) {
      this.id = id;
      this.postId = postId;
      this.comment = comment;
      this.author = author;
      this.authorId = authorId;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
  