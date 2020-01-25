using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;


namespace API.Models
{
    public class FlixGoRepository : IFlixGoRepository
    {
        private readonly FlixGoContext _context;
        private readonly int _page_size = 50;

        public FlixGoRepository(FlixGoContext context)
        {
            _context = context;
        }

        // P O S T S


        public IEnumerable<PostItem> GetPosts()
        {
            return _context.PostItems.Include(x => x.Category).Include(x => x.Author).Include(x => x.Tags).OrderBy(x => x.Creation).ToList();
        }

        public IEnumerable<PostItem> GetPostsByPage(int? mediaId, int? categoryId, int? tagId, string filter, int page)
        {
            var qry = _context.PostItems
                .Include(x => x.Category)
                .Include(x => x.Author)
                .Include(x => x.Tags)
                .OrderBy(x => x.Creation)
                .AsQueryable();

            if (mediaId != null)
            {
                EnumMedia media = (EnumMedia)mediaId;
                qry = qry.Where(x => x.Media == media);
            }

            if (categoryId != null)
                qry = qry.Where(x => x.CategoryId == categoryId);

            if (tagId != null)
                qry = qry.Where(x => x.Tags.Exists(y => y.Id == tagId));

            if (filter != null)
                qry = qry.Where(x => x.FrenchTitle.Contains(filter, StringComparison.InvariantCultureIgnoreCase));

            qry = qry.Skip((page - 1) * _page_size).Take(_page_size);

            return qry.ToList();
        }

        public IEnumerable<PostItem> GetPostsInFavorites()
        {
            return _context.PostItems.Include(x => x.Category).Include(x => x.Author).Include(x => x.Tags).Where(x => x.Favorite == true).ToList();
        }

        public PostItem GetPost(int id)
        {
            var result = _context.PostItems.Include(x => x.Category).Include(x => x.Author).Include(x => x.Tags).Where(t => t.Id == id).FirstOrDefault();
            return result;
        }

        public int GetTotalPostPages()
        {
            int val = (_context.PostItems.Count() + _page_size - 1) / _page_size;
            return val;
        }

        public void CreatePost(PostItem item)
        {
            _context.PostItems.Add(item);
            _context.SaveChanges();
        }

        public void AddPostToFavorite(int id)
        {
            var post = _context.PostItems.Where(x => x.Id == id).SingleOrDefault();
            if (post != null)
            {
                post.Favorite = true;
                _context.SaveChanges();
            }
        }

        public void RemovePostFromFavorite(int id)
        {
            var post = _context.PostItems.Where(x => x.Id == id).SingleOrDefault();
            if (post != null)
            {
                post.Favorite = false;
                _context.SaveChanges();
            }
        }

        public void UpdatePost(PostItem item)
        {
            _context.PostItems.Update(item);
            _context.SaveChanges();
        }

        public void DeletePost(int id)
        {
            var entity = _context.PostItems.First(t => t.Id == id);
            if (entity != null)
            {
                _context.PostItems.Remove(entity);
                _context.SaveChanges();
            }
        }

        // T A G S

        public void CreateTag(Tag item)
        {
            _context.Tags.Add(item);
            _context.SaveChanges();
        }

        public IEnumerable<Tag> GetAllTags()
        {
            return _context.Tags.ToList();
        }

        public Tag GetTag(int id)
        {
            var result = _context.Tags.Where(t => t.Id == id).FirstOrDefault();
            return result;
        }

        public void UpdateTag(int postId, string tagOldName, string tagNewName, string language)
        {
            var entity = _context.Tags.Where(x => x.PostItemId == postId && x.Name == tagOldName && x.language == language).SingleOrDefault();
            if (entity != null)
            {
                entity.Name = tagNewName;
                _context.SaveChanges();
            }
        }

        public void DeleteTag(int tagId)
        {
            var entity = _context.Tags.Where(x => x.Id == tagId).SingleOrDefault();
            if (entity != null)
            {
                _context.Tags.Remove(entity);
                _context.SaveChanges();
            }
        }

        // C A T E G O R I E S

        public void CreateCategory(Category item)
        {
            _context.Categories.Add(item);
            _context.SaveChanges();
        }

        public IEnumerable<Category> GetAllCategories()
        {
            return _context.Categories.ToList();
        }

        public Category GetCategory(int id)
        {
            var result = _context.Categories.Where(t => t.Id == id).FirstOrDefault();
            return result;
        }

        public void UpdateCategory(Category item)
        {
            _context.Categories.Update(item);
            _context.SaveChanges();
        }

        public void DeleteCategory(int id)
        {
            var cat = _context.Categories.Where(x => x.Id == id).SingleOrDefault();
            if (cat != null)
            {
                _context.Categories.Remove(cat);
                _context.SaveChanges();
            }
        }

        // A U T H O R S

        public void CreateAuthor(Author item)
        {
            _context.Authors.Add(item);
            _context.SaveChanges();
        }

        public IEnumerable<Author> GetAllAuthors()
        {
            return _context.Authors.ToList();
        }

        public Author GetAuthor(int id)
        {
            var result = _context.Authors.Where(t => t.Id == id).FirstOrDefault();
            return result;
        }

        public Author GetAuthorByName(string name)
        {
            var result = _context.Authors.Where(t => t.Name == name).FirstOrDefault();
            return result;
        }

        public void UpdateAuthor(Author item)
        {
            _context.Authors.Update(item);
            _context.SaveChanges();
        }

        public void DeleteAuthor(int id)
        {
            var aut = _context.Authors.Where(x => x.Id == id).SingleOrDefault();
            if (aut != null)
            {
                _context.Authors.Remove(aut);
                _context.SaveChanges();
            }
        }

        // U S E R S

        public void CreateUser(User item)
        {
            _context.Users.Add(item);
            _context.SaveChanges();
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public User GetUser(int id)
        {
            var result = _context.Users.Where(t => t.Id == id).FirstOrDefault();
            return result;
        }

        public User GetUserByUserName(string userName)
        {
            var result = _context.Users.Where(t => t.UserName == userName).FirstOrDefault();
            return result;
        }

        public void UpdateUser(User item)
        {
            _context.Users.Update(item);
            _context.SaveChanges();
        }

        public void DeleteUser(int id)
        {
            var user = _context.Users.Where(x => x.Id == id).SingleOrDefault();
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }

        public void ApproveUser(int userId)
        {
            var entity = _context.Users.Where(x => x.Id == userId).SingleOrDefault();
            if (entity != null)
            {
                entity.Status = EnumStatus.Approved;
                _context.SaveChanges();
            }
        }

        public void BanUser(int userId)
        {
            var entity = _context.Users.Where(x => x.Id == userId).SingleOrDefault();
            if (entity != null)
            {
                entity.Status = EnumStatus.Banned;
                _context.SaveChanges();
            }
        }

    }
}
