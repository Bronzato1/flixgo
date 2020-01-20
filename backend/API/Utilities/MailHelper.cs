using System.Net.Mail;
using System.Text;

namespace API.Utilities
{
    public class MailHelper
    {
        SmtpClient _client;
        Secret _secret;

        public MailHelper()
        {
            _secret = new Secret();
            _client = new SmtpClient();
            _client.Host = _secret.SmtpHost;
            _client.Port = 587;
            _client.UseDefaultCredentials = false;
            _client.Credentials = new System.Net.NetworkCredential(_secret.SmtpMailFrom, _secret.SmtpPassword);
            _client.EnableSsl = true;
            _client.DeliveryMethod = SmtpDeliveryMethod.Network;
        }

        public bool SendMail(string name, string email, string phone, string message)
        {
            MailAddress from = new MailAddress(_secret.SmtpMailFrom, name);
            MailAddress to = new MailAddress(_secret.SmtpMailTo);
            MailMessage mail = new MailMessage(from, to);

            mail.Subject = "Azur blogging";
            mail.IsBodyHtml = true;
            mail.Body = "<p>Nom: " + name + "</p><p>Message: " + message + "</p><p>Tél: " + phone + "</p><p>Mail: " + email + "</p>";
            mail.ReplyToList.Add(email);

            try
            {
                _client.Send(mail);
                return true;
            }
            catch (SmtpException)
            {
                return false;
            }
        }
        public bool Signup(string email)
        {
            MailAddress from = new MailAddress(_secret.SmtpMailFrom);
            MailAddress to = new MailAddress(_secret.SmtpMailTo);
            MailMessage mail = new MailMessage(from, to);

            mail.Subject = "Azur blogging";
            mail.IsBodyHtml = true;
            mail.Body = "<p>Newsletter signup: " + email + "</p>";
            mail.ReplyToList.Add(email);

            try
            {
                _client.Send(mail);
                return true;
            }
            catch (SmtpException)
            {
                return false;
            }
        }
    }
}