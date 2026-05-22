using Microsoft.EntityFrameworkCore;
using IdentityService.Data;
using IdentityService.Models;
using IdentityService.Models.Dtos;

namespace IdentityService.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public AuthService(
        ApplicationDbContext context,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<AuthResultDto?> LoginAsync(LoginDto dto)
    {
        // 1. Lógica de negocio: Buscar usuario en SQLite
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());

        if (user == null) return null;

        // 2. Lógica de negocio: Verificar hash de contraseña
        bool isPasswordValid = _passwordHasher.VerifyPassword(dto.Password, user.PasswordHash);
        if (!isPasswordValid) return null;

        // 3. Lógica de negocio: Generar token JWT
        string token = _tokenService.CreateToken(user);

        return new AuthResultDto(token);
    }

    public async Task<bool> RegisterAsync(RegisterDto dto)
    {
        // 1. Validar si el correo ya existe en SQLite para evitar duplicados
        var emailExists = await _context.Users
            .AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower());
        
        if (emailExists) return false;

        // 2. Hashear la contraseña usando la utilidad de BCrypt.Net-Next (Genera el salt automáticamente por debajo)
        // Usamos la ruta absoluta o el alias que configuraste previamente
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        // 3. Crear la entidad con rol predeterminado de Cliente
        var newUser = new User
        {
            Email = dto.Email,
            PasswordHash = hashedPassword,
            Roles = new List<string> { "Client" }
        };

        // 4. Guardar los cambios de forma asíncrona en la base de datos local
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return true;
    }
}
