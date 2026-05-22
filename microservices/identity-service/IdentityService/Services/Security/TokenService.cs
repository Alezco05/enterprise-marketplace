using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Linq;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using IdentityService.Models;

namespace IdentityService.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string CreateToken(User user)
    {
        // 1. Leer el secreto compartido desde appsettings.Development.json
        var secret = _configuration["Jwt:Secret"];
        if (string.IsNullOrEmpty(secret) || secret.Length < 32)
        {
            throw new InvalidOperationException("⚠️ La clave secreta del JWT debe tener al menos 32 caracteres.");
        }

        // 2. Configurar los Claims básicos
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };

        // 🚀 MEJORA SENIOR: Recorremos la lista de roles del usuario y los añadimos como claims individuales.
        // Usamos el string literal "roles" para que en el JSON final quede como un arreglo que Express pueda leer fácilmente.
        if (user.Roles != null)
        {
            claims.AddRange(user.Roles.Select(role => new Claim("roles", role)));
        }

        // 3. Generar la clave simétrica con el secreto de 32 caracteres
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        // El token expirará en 1 hora
        var expiration = DateTime.UtcNow.AddHours(1);

        // 4. Crear el objeto Token (Omitimos Issuer y Audience para simplificar las pruebas locales)
        var token = new JwtSecurityToken(
            claims: claims,
            expires: expiration,
            signingCredentials: credentials);

        // 5. Serializar a un string plano (ey...)
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
