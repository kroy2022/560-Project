using System.ComponentModel.DataAnnotations;

namespace Team11API.DTOs
{
    // Sent DTO's (from UI to backend)
    public class SavedBooksBody
    {
        [Required]
        public int UserID { get; set; }
    }
    
    // Helper classes
    public class PopularBook : Book
    {
        public double avgRating { get; set; }
        public int? totalReviews { get; set; }
    }
    public class Book
    {
        public Book()
        {
            bookId = 0;
            isbn = "";
            title = "";
            description = "";
            publisher = "";
            author = "";
            coverImage = "";
            genre = "";
            publicationDate = DateTime.Today;
        }
        
        public int bookId { get; set; }
        public string isbn { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string publisher { get; set; }
        public string author { get; set; }
        public string coverImage { get; set; }
        public string genre { get; set; }

        public DateTime publicationDate { get; set; }
        public int? isSaved { get; set; }
    }

    public class GenreRow
    {
        public string genre { get; set; }
        public int genreId { get; set; }
        public List<Book> genreBooks { get; set; }

        public int offset { get; set; }
    }

    // Return DTO's (from backend to UI)
    public class FeaturedBookDto
    {
        public PopularBook featuredBook { get; set; }
    }

    public class PopularBooksDto
    {
        public List<PopularBook> popularBooks { get; set; }
    }

    public class RowBooksDto
    {
        public List<Book> books { get; set; }
    }

    public class GenreRowsDto
    {
        public List<GenreRow> genreRows { get; set; }
    }

    public class SearchResultsDto
    {
        public List<Book> searchResults { get; set;}
    }
}