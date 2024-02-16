import { createContext, useState } from "react";
import { faker } from "@faker-js/faker";



//1. create the context
const PostContext = createContext();


// 2. create  the Provider function that returns the provider
function PostProvider({children}){


  // 3. add all state and functions we need
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );

  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts = searchQuery.length > 0 ? posts.filter((post) => `${post.title} ${post.body}`.toLowerCase().includes(searchQuery.toLowerCase())) : posts;

  function handleAddPost(post) {
    setPosts((posts) => (
      [...posts, post]
    ))
  }

  function handleClearPosts() {
    setPosts([]);
  }

  function createRandomPost() {
    return {
      title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
      body: faker.hacker.phrase(),
    };
  }


   // 3. return all values we need to the provider
   // the values represent all state and functions we have above using an object
   // then we call each key inside the wrapped component where each state or function is needed

  return(
    <PostContext.Provider value={{
      posts: searchedPosts, // the derived state that holds the posts
      query: searchQuery, // the query
      querySetter: setSearchQuery, // query setter function
      addPostHandler: handleAddPost, // add post function
      clearPostHander: handleClearPosts, // clear posts function
    }}>
      {children}
    </PostContext.Provider>
  )

  
} // close the PostProvider function


export {PostContext, PostProvider} // export the postContext to use AND the Provider to wrap all components