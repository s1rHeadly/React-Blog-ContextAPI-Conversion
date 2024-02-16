import { useContext, useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { PostContext, PostProvider } from "./PostContext";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}




function App() {
  const [isFakeDark, setIsFakeDark] = useState(false);



  // Whenever `isFakeDark` changes, we toggle the `fake-dark-mode` class on the HTML element (see in "Elements" dev tool).
  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );



   

  return (
    /**
     * step 2. Since we created a useContext called PostContext,
     * we need Provide value to the child components by adding .Provider
     * Then when we wrap our main component, all components will have access
    */
   
   
    <section>
      <button
        onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
        className="btn-fake-dark-mode"
      >
        {isFakeDark ? "☀️" : "🌙"}
      </button>
      {/* Note how we are wrapping the prover around the components that need the global state and functions */}
      <PostProvider>
      <Header/>
      <Main/>
      <Archive />
      <Footer />
      </PostProvider>

    </section>
   
  );
}

function Header() {

  const {clearPostHander} = useContext(PostContext);

  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results/>
        <SearchPosts />
        <button onClick={clearPostHander}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  const {query, querySetter} = useContext(PostContext)
  return (
    <input
      value={query}
      onChange={(e) => querySetter(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Results() {
  const {posts} = useContext(PostContext)
  return <p>🚀 {posts.length} atomic posts found</p>;
}

function Main() {
  return (
    <main>
      <FormAddPost/>
      <Posts/>
    </main>
  );
}

function Posts() {
  return (
    <section>
      <List />
    </section>
  );
}

function FormAddPost() {
  const { addPostHandler} = useContext(PostContext)

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!body || !title) return;
    addPostHandler({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
      />
      <button>Add post</button>
    </form>
  );
}

function List() {
  const {posts} = useContext(PostContext)
  return (
    <ul>
      {posts.map((post, i) => (
        <li key={i}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

function Archive() {
  // Here we don't need the setter function. We're only using state to store these posts because the callback function passed into useState (which generates the posts) is only called once, on the initial render. So we use this trick as an optimization technique, because if we just used a regular variable, these posts would be re-created on every render. We could also move the posts outside the components, but I wanted to show you this trick 😉
 

  const [showArchive, setShowArchive] = useState(false);


  const {addPostHandler, posts} = useContext(PostContext)

  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>

      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button onClick={() => addPostHandler(post)}>Add as new post</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;
