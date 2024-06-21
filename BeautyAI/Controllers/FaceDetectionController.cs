using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using System.Diagnostics;

[Route("api/[controller]")]
[ApiController]
public class FaceDetectionController : ControllerBase
{
    [HttpPost("detect")]
    public async Task<IActionResult> Detect([FromForm] IFormFile file)
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

        var result = await DetectFace(filePath);

        return Ok(new { result });
    }

    private async Task<string> DetectFace(string filePath)
    {
        var psi = new ProcessStartInfo
        {
            FileName = "/opt/anaconda3/envs/psgan_env/bin/python",
            Arguments = $"/Users/sofabazueva/Desktop/PSGAN-master/face_detection.py \"{filePath}\"",
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
                throw new Exception($"Error detecting face: {error}");
            }

            return output.Trim();
        }
    }
}
