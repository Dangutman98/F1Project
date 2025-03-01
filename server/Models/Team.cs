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
            //created it because properties are non-nullable(c# Compiler Error issue)
            name = string.Empty;
            color = string.Empty;
        }

        public Team(int id, string name, string color)
        {
            this.id = id;
            this.name = name;
            this.color = color;
        }
    }
}
