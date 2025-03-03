namespace server.Models
{
    public class Team
    {
        // Use auto-implemented properties
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Color { get; set; }

        // Empty constructor
        public Team()
        {
            // Ensure properties are non-nullable
            Name = string.Empty;
            Color = string.Empty;
        }

        // Constructor for initialization
        public Team(int id, string name, string color)
        {
            Id = id;
            Name = name;
            Color = color;
        }
    }
}
