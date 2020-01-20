using System;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json.Linq;
using API.Models;

namespace API.Controllers
{
    [EnableCors("AureliaSPA")]
    [Route("api/[controller]")]
    public class CategoryController : Controller
    {
        private readonly IHostingEnvironment _HostingEnvironment;
        private readonly FlixGoContext _FlixGoContext;
        private IFlixGoRepository _FlixGoRepository { get; set; }

        public CategoryController(IHostingEnvironment hostingEnvironment, FlixGoContext flixGoContext, IFlixGoRepository flixGoRepository)
        {
            _HostingEnvironment = hostingEnvironment;
            _FlixGoContext = flixGoContext;
            _FlixGoRepository = flixGoRepository;
        }

        [HttpPost]
        public IActionResult CreateCategory([FromBody] Category item)
        {
            if (item == null)
            {
                return BadRequest();
            }
            _FlixGoRepository.CreateCategory(item);
            return CreatedAtRoute("GetCategory", new { id = item.Id }, item);
        }

        [HttpGet]
        public IEnumerable<Category> GetAll()
        {
            return _FlixGoRepository.GetAllCategories();
        }

        [HttpGet("{id}", Name = "GetCategory")]
        public IActionResult GetById(int id)
        {
            var item = _FlixGoRepository.GetCategory(id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCategory(int id, [FromBody] Category item)
        {
            if (item == null || item.Id != id)
            {
                return BadRequest();
            }

            var category = _FlixGoRepository.GetCategory(id);
            if (category == null)
            {
                return NotFound();
            }

            category.FrenchName = item.FrenchName;
            category.EnglishName = item.EnglishName;
            category.Color = item.Color;
            category.ImageText = item.ImageText;
            category.ImageAudio = item.ImageAudio;
            category.ImageVideo = item.ImageVideo;

            _FlixGoRepository.UpdateCategory(category);
            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCategory(int id)
        {
            _FlixGoRepository.DeleteCategory(id);
            return new NoContentResult();
        }
    }
}
