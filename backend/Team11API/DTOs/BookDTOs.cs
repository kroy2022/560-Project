using System.ComponentModel.DataAnnotations;

namespace Team11API.DTOs
{
    // Sent DTO's (from ui to backend)
    public class SaveBookBody
    {
        [Required]
        public int bookId { get; set; }
        [Required]
        public int userId { get; set; } 
        [Required]
        public int isCurrentlySaved { get; set; }
    }

    public class WriteReviewBody
    {
        [Required]
        public int bookId { get; set; }
        [Required]
        public int userId { get; set; } 
        [Required]
        public int rating { get; set; }
        [Required]
        public string content { get; set; } = "";
    }

    // Helper classes
    public class BookSummary {
        public int bookId { get; set; }
        public string title { get; set; }
        public string coverImage { get; set; }
        public string author { get; set; }
    }

    public class BookReview
    {
        public int reviewId { get; set; }
        public int userId { get; set; }
        public string userName { get; set; }
        public int rating { get; set; }
        public string content { get; set; }
        public DateTime reviewDate { get; set; }

        public BookReview()
        {
            reviewId = 0;
            userId = 0;
            userName = string.Empty;
            rating = 0;
            content = string.Empty;
            reviewDate = DateTime.MinValue; 
        }
    }


    // Return DTO's (from backend to ui)
    public class BookInformationDto
    {
        public Book book { get; set; }
    }

    public class BookReviewsDto
    {
        public List<BookReview> reviews { get; set; }
    }

    public class SavedBooksDto
    {
        public List<BookSummary> similarBooks { get; set; }
    }

    public class CreateReviewDto
    {
        public int reviewId { get; set; }
    }
}