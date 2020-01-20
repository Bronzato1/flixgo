using API.Utilities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace API.Controllers
{
    [EnableCors("AureliaSPA")]
    [Route("api/[controller]")]
    public class MailController : Controller
    {
        MailHelper _mailHelper;

        public MailController()
        {
            _mailHelper = new MailHelper();
        }

        [HttpPost("SendMail")]
        public IActionResult SendMail([FromBody] JObject obj)
        {
            var name = (string)obj.GetValue("name");
            var email = (string)obj.GetValue("email");
            var phone = (string)obj.GetValue("phone");
            var message = (string)obj.GetValue("message");
            var ret = _mailHelper.SendMail(name, email, phone, message);
            return Ok(new { success = ret});
        }

        [HttpPost("Signup")]
        public IActionResult Signup([FromBody] JObject obj)
        {
            var email = (string)obj.GetValue("email");
            var ret = _mailHelper.Signup(email);
            return Ok(new { success = ret});
        }
    }
}