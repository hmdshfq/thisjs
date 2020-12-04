function Book(title, author, genre) {
  this.title = title;
  this.author = author;
  this.genre = genre;
}
const book1 = new Book("Lord Of The Rings", "J.R.R. Tolkien", "Fantasy");
const book2 = new Book("Tools Of Titans", "Tim Ferriss", "Self-help");
 
console.log(book1);
console.log(book2);