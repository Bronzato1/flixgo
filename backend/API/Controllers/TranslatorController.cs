using API.Utilities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace API.Controllers 
{
    [EnableCors("AureliaSPA")]
    [Route("api/[controller]")]
    public class TranslatorController : Controller
    {
        Translator _translator;

        public TranslatorController()
        {
            _translator = new Translator();
        }

        [HttpPost("Translate")]
        public IActionResult Translate([FromBody] JObject obj)
        {
            var from = (string)obj.GetValue("from");
            var to = (string)obj.GetValue("to");
            var html = (string)obj.GetValue("html");
            var translated = _translator.Translate(from, to, html);
            return Ok(new { success = translated});
        }
    }
}