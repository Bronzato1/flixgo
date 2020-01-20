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
    public class TagController : Controller
    {
        private readonly IHostingEnvironment _HostingEnvironment;
        private readonly FlixGoContext _FlixGoContext;
        private IFlixGoRepository _FlixGoRepository { get; set; }

        public TagController(IHostingEnvironment hostingEnvironment, FlixGoContext flixGoContext, IFlixGoRepository flixGoRepository)
        {
            _HostingEnvironment = hostingEnvironment;
            _FlixGoContext = flixGoContext;
            _FlixGoRepository = flixGoRepository;
        }

        [HttpPost]
        public IActionResult CreateTag([FromBody] Tag item)
        {
            if (item == null)
            {
                return BadRequest();
            }
            _FlixGoRepository.CreateTag(item);
            return Ok();
        }

        [HttpGet]
        public IEnumerable<Tag> GetAll()
        {
            return _FlixGoRepository.GetAllTags();
        }

        [HttpPost("UpdateTag")]
        public IActionResult UpdateTag([FromBody] JObject obj)
        {
            var postId = (int)obj.GetValue("postId");
            var tagOldName = (string)obj.GetValue("tagOldName");
            var tagNewName = (string)obj.GetValue("tagNewName");
            var language = (string)obj.GetValue("language");
            _FlixGoRepository.UpdateTag(postId, tagOldName, tagNewName, language);
            return Ok();
        }

        [HttpPost("DeleteTag")]
        public IActionResult DeleteTag([FromBody] JObject obj)
        {
            var tagId = (int)obj.GetValue("tagId");
            _FlixGoRepository.DeleteTag(tagId);
            return Ok();
        }
    }
}
