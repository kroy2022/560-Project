using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Team11API.Services
{
    public class Database
    {
        private readonly string _connectionString;

        public Database(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("Team11DB")
                ?? throw new InvalidOperationException("Missing Team11DB connection string.");
        }

        public SqlConnection GetConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}
