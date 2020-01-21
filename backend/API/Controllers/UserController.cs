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
    public class UserController : Controller
    {
        private readonly IHostingEnvironment _HostingEnvironment;
        private readonly FlixGoContext _FlixGoContext;
        private IFlixGoRepository _FlixGoRepository { get; set; }

        public UserController(IHostingEnvironment hostingEnvironment, FlixGoContext flixGoContext, IFlixGoRepository flixGoRepository)
        {
            _HostingEnvironment = hostingEnvironment;
            _FlixGoContext = flixGoContext;
            _FlixGoRepository = flixGoRepository;
        }

        [HttpPost]
        public IActionResult CreateUser([FromBody] User item)
        {
            if (item == null)
            {
                return BadRequest();
            }
            _FlixGoRepository.CreateUser(item);
            return CreatedAtRoute("GetAuthor", new { id = item.Id }, item);
        }

        [HttpGet]
        public IEnumerable<User> GetAll()
        {
            return _FlixGoRepository.GetAllUsers();
        }

        [HttpGet("{id}", Name = "GetUser")]
        public IActionResult GetById(int id)
        {
            var item = _FlixGoRepository.GetUser(id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }

        [HttpPost("ApproveUser")]
        public IActionResult ApproveUser([FromBody] JObject obj)
        {
            var userId = (int)obj.GetValue("userId");
            _FlixGoRepository.ApproveUser(userId);
            return Ok();
        }

        [HttpPost("BanUser")]
        public IActionResult BanUser([FromBody] JObject obj)
        {
            var userId = (int)obj.GetValue("userId");
            _FlixGoRepository.BanUser(userId);
            return Ok();
        }

        [HttpGet("GetUserByName/{name}")]
        public IActionResult GetByUserName(string userName)
        {
            var item = _FlixGoRepository.GetUserByUserName(userName);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User item)
        {
            if (item == null || item.Id != id)
            {
                return BadRequest();
            }

            var author = _FlixGoRepository.GetUser(id);
            if (author == null)
            {
                return NotFound();
            }

            author.UserName = item.UserName;
            author.FirstName = item.FirstName;
            author.LastName = item.LastName;

            _FlixGoRepository.UpdateUser(author);
            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            _FlixGoRepository.DeleteUser(id);
            return new NoContentResult();
        }
    }
}
