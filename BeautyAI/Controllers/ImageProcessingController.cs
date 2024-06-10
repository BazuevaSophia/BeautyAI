using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using System.Diagnostics;

[Route("api/[controller]")]
[ApiController]
public class ImageProcessingController : ControllerBase
{
    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Upload a file");

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
        Directory.CreateDirectory(uploadsPath); 
        var filePath = Path.Combine(uploadsPath, file.FileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var processedImagePath = await ProcessImage(filePath);

        var imageBytes = await System.IO.File.ReadAllBytesAsync(processedImagePath);
        return File(imageBytes, "image/png");
    }

    private async Task<string> ProcessImage(string filePath)
    {
        var outputDirectory = Path.Combine(Directory.GetCurrentDirectory(), "output");
        var outputFilePath = Path.Combine(outputDirectory, $"{Path.GetFileNameWithoutExtension(filePath)}_processed.png");

       
        if (!Directory.Exists(outputDirectory))
        {
            Directory.CreateDirectory(outputDirectory);
        }

        var psi = new ProcessStartInfo
        {
            FileName = "/opt/anaconda3/envs/psgan_env/bin/python", 
            Arguments = $"/Users/sofabazueva/Desktop/PSGAN-master/demo.py --source_path \"{filePath}\" --save_path \"{outputFilePath}\"",
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        using (var process = Process.Start(psi))
        {
            await process.WaitForExitAsync();
            var output = await process.StandardOutput.ReadToEndAsync();
            var error = await process.StandardError.ReadToEndAsync();

            if (process.ExitCode != 0)
            {
                throw new Exception($"Error processing image: {error}");
            }
        }

        return outputFilePath;
    }
}
