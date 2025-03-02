namespace server.Models
{
    public class Driver
    {
        private int id;
        private string name;
        private string photoURL;
        private int? teamId;
        private string acronymName;

        public int Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string PhotoURL { get => photoURL; set => photoURL = value; }
        public int? TeamId { get => teamId; set => teamId = value; }
        public string AcronymName { get => acronymName; set => acronymName = value; }

        // empty constructor
        public Driver()
        {
            name = string.Empty;
            photoURL = string.Empty;
            acronymName = string.Empty;
        }

        public Driver(int id, string name, string photoURL, int teamId, string acronymName)
        {
            this.id = id;
            this.name = name;
            this.photoURL = photoURL;
            this.teamId = teamId;
            this.acronymName = acronymName;
        }
    }
}