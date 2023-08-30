import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios, { CancelTokenSource } from 'axios';


interface IPost {
  id: number;
  userId?: number;
  title: string;
  body: string;
}
const defaultPosts: IPost[] = [];
const App = () => {
  const [posts, setPosts]: [IPost[], (posts: IPost[]) => void] = React.useState(defaultPosts);
  const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
  const [error, setError]: [string, (error: string) => void] = React.useState("");

  // Canceling requests
  const cancelToken = axios.CancelToken; //create cancel token
  const [cancelTokenSource, setCancelTokenSource]: [CancelTokenSource, (cancelTokenSource: CancelTokenSource) => void] = React.useState(cancelToken.source());

  const handleCancelClick = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("User cancelled operation");
    }
  };

  React.useEffect(() => {
    // TODO - get posts
    axios.get<IPost[]>("https://jsonplaceholder.typicode.com/posts", {
      cancelToken: cancelTokenSource.token,
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 1200
    }).then(response => {
      setPosts(response.data);
      setLoading(false);
    }).catch(ex => {
      const error = axios.isCancel(ex) ? 'Request Cancelled' : ex.code === "ECONNABORTED" ? "A timeout has occurred" : ex.response.status === 404 ? "Resource Not found" : "An unexpected error has occurred";
      setError(error);
      setLoading(false);
    });

    // cancelTokenSource.cancel("User cancelled operation");
  }, []);

  return (
    <div className="App">
      {loading && (
        <button onClick={handleCancelClick}>Cancel</button>
      )}
      <ul className="posts">
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
