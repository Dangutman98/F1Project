namespace server.Models
{
    public class Article
    {
        public int Id { get; set; } // Primary Key
        public required string Title { get; set; }
        public required string Content { get; set; }
        public int AuthorId { get; set; } // Foreign Key to User (author of the article)
        public DateTime PublishedAt { get; set; }
    }
}
