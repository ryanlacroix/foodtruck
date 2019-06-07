export class User {
    public username: string;
    public recipesLiked: number[] = [];
    public recipesDisliked: number[] = [];
    public recipesQueued: number[] = [];
    constructor() {
    }
  }