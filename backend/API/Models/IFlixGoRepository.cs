using System.Collections.Generic;

namespace API.Models
{
    public interface IFlixGoRepository
    {
        // P O S T S

        IEnumerable<PostItem> GetPosts();                               // GET
        IEnumerable<PostItem> GetPostsByPage(int? mediaId, int? categoryId, int? tagId, string filter, int id);  // GET
        IEnumerable<PostItem> GetPostsInFavorites();                    // GET
        PostItem GetPost(int id);                                       // GET
        int GetTotalPostPages();                                        // GET
        void CreatePost(PostItem item);                                 // POST
        void AddPostToFavorite(int id);                                 // POST
        void RemovePostFromFavorite(int id);                            // POST
        void UpdatePost(PostItem item);                                 // UPDATE
        void DeletePost(int id);                                        // DELETE

        // T A G S

        void CreateTag(Tag item);                                                           // CREATE
        IEnumerable<Tag> GetAllTags();                                                      // READ
        Tag GetTag(int id);                                                                 // READ
        void UpdateTag(int postId, string tagOldName, string tagNewName, string language);  // UPDATE
        void DeleteTag(int tagId);                                                          // DELETE

        // C A T E G O R I E S

        void CreateCategory(Category item);         // CREATE
        IEnumerable<Category> GetAllCategories();   // READ
        Category GetCategory(int id);               // READ
        void UpdateCategory(Category item);         // UPDATE
        void DeleteCategory(int categoryId);        // DELETE

        // A U T H O R S

        void CreateAuthor(Author item);             // CREATE
        IEnumerable<Author> GetAllAuthors();        // READ
        Author GetAuthor(int id);                   // READ
        Author GetAuthorByName(string name);        // READ
        void UpdateAuthor(Author item);             // UPDATE
        void DeleteAuthor(int authorId);            // DELETE

        // U S E R S

        void CreateUser(User item);                 // CREATE
        IEnumerable<User> GetAllUsers();            // READ
        User GetUser(int id);                       // READ
        User GetUserByUserName(string userName);    // READ
        void UpdateUser(User item);                 // UPDATE
        void DeleteUser(int userId);                // DELETE
    }
}
