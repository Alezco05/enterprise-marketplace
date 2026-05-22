using Microsoft.EntityFrameworkCore;
using IdentityService.Data;
using IdentityService.Services;

var builder = WebApplication.CreateBuilder(args);

// Registrar el contexto de base de datos
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddAuthorization();
//Registro de los servicios de lógica de negocio (Inyección de Dependencias)
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("GatewayPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Permite peticiones estrictamente desde tu Gateway Express
              .AllowAnyMethod()                     // Permite POST, GET, PUT, DELETE, etc.
              .AllowAnyHeader();                    // Permite cualquier cabecera (incluyendo tus cabeceras X-User-*)
    });
});


var app = builder.Build();

// Configurar el pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("GatewayPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run();
