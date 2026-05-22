namespace IdentityService.Services;

public interface IPasswordHasher
{
    bool VerifyPassword(string password, string passwordHash);
}
