using Team11API.Services;

namespace Team11API.Models
{
    public class BooksModel
    {
        private readonly Database _db;
        
        public BooksModel(Database db)
        {
            _db = db;
        }


    }
}
