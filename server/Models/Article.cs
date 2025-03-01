namespace server.Models
{
    public class Article
    {
        private int id;
        private string title = string.Empty; // Initialize with default value
        private string content = string.Empty; // Initialize with default value
        private int authorId;
        private DateTime publishedAt;

        public int Id { get => id; set => id = value; }
        public string Title { get => title; set => title = value; }
        public string Content { get => content; set => content = value; }
        public int AuthorId { get => authorId; set => authorId = value; }
        public DateTime PublishedAt { get => publishedAt; set => publishedAt = value; }

        // empty constructor
        public Article()
        {
        }

        public Article(int id, string title, string content, int authorId, DateTime publishedAt)
        {
            Id = id;
            Title = title;
            Content = content;
            AuthorId = authorId;
            PublishedAt = publishedAt;
        }
    }
}
