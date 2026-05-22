namespace IdentityService.Services;

public class PasswordHasher : IPasswordHasher
{
    public bool VerifyPassword(string password, string passwordHash)
    {
        // 🚀 SOLUCIÓN: Invocamos la ruta completa absoluta para romper la ambigüedad del compilador
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }
}
