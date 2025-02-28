namespace server.Models
{
    public class Team
    {
        private int id;
        private string name;
        private string color;

        public int Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string Color { get => color; set => color = value; }

        // empty constructor
        public Team()
        {
        }

        public Team(int id, string name, string color)
        {
            Id = id;
            Name = name;
            Color = color;
        }
    }
}





