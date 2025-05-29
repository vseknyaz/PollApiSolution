using PollApi;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
///


// cd D:\vsevolod\university\oop\LABA\PollApiSolution\PollApi
// додаємо JSON циклічні налаштування
builder.Services.AddControllers()
    .AddNewtonsoftJson(opt =>
        opt.SerializerSettings.ReferenceLoopHandling =
            Newtonsoft.Json.ReferenceLoopHandling.Ignore);

// реєструємо контекст
builder.Services.AddDbContext<PollContext>(opts =>
    opts.UseSqlServer(builder.Configuration
        .GetConnectionString("DefaultConnection")));

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.MapControllers();

app.Run();
