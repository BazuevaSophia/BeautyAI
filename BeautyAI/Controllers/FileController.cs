using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BeautyAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly string _imageDirectory = "/Users/sofabazueva/Projects/BeautyAI/BeautyAI/inp";

        [HttpGet("list")]
        public IActionResult GetImageList()
        {
            if (!Directory.Exists(_imageDirectory))
            {
                return NotFound("Directory not found");
            }

            var files = Directory.GetFiles(_imageDirectory)
                .Select(Path.GetFileName)
                .ToList();
            return Ok(files);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Upload a file");

            var filePath = Path.Combine(_imageDirectory, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { file = file.FileName });
        }
    }
}
