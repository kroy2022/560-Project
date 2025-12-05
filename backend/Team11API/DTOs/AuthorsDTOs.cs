using System.ComponentModel.DataAnnotations;
using System.Net.NetworkInformation;
using Microsoft.Identity.Client;

namespace Team11API.DTOs
{
    // Helper Classes
    public class Author : AuthorSummary
    {
        public List<string> genres { get; set; } 
        public int totalBooks { get; set; } 
        public double? avgRating { get; set; } 
        public string? description { get; set; } 
    }

    public class AuthorSummary 
    {
        public int authorId { get; set; } 
        public string name { get; set; } 
        public double? avgRating { get; set; } 
        public string? coverImage { get; set; }
    }

    // Sent DTOs
    
    // Return DTOs
    public class AllAuthorsDto
    {
        public List<AuthorSummary> authors { get; set; }
        public int totalBooks { get; set; }
        public int totalGenres { get; set; } 
    }

    public class AuthorInformationDto
    {
        public Author author { get; set; }
    }

    public class AuthorBooksDto
    {
        public List<BookSummary> authorBooks { get; set; }
    }
}