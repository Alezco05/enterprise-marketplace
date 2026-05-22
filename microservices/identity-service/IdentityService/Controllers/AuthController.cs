using Microsoft.AspNetCore.Mvc;
using IdentityService.Models.Dtos;
using IdentityService.Services;

namespace IdentityService.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        // El controlador solo delega el trabajo pesado al servicio de aplicación
        var result = await _authService.LoginAsync(dto);

        // Si el servicio devuelve null, el controlador decide responder un 401 HTTP
        if (result == null)
        {
            return Unauthorized(new { message = "Credenciales inválidas" });
        }

        // Si todo está OK, responde un 200 HTTP con el token
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var isSuccess = await _authService.RegisterAsync(dto);

        if (!isSuccess)
        {
            return BadRequest(new { message = "El correo electrónico ya se encuentra registrado." });
        }

        return Ok(new { message = "Usuario registrado exitosamente." });
    }

}
