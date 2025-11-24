namespace Team11API.DTOs
{
    // Sent DTO's (from UI to backend)
    public class SignInBody
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class SignUpBody
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }


    // Return DTO's (to be sent to UI)
    public class AuthDto
    {
        public int? UserID { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public bool IsValid { get; set; }
    }
}
