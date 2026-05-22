using IdentityService.Models.Dtos;

namespace IdentityService.Services;

public interface IAuthService
{
    // Devuelve el DTO con el token si es exitoso, o null si las credenciales fallan
    Task<AuthResultDto?> LoginAsync(LoginDto dto);
    Task<bool> RegisterAsync(RegisterDto dto);
}
