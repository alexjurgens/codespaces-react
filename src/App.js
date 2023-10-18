import React, { useState, useEffect } from "react";
import "./styles.css";
import uuid from "uuid/v1";
import urls from "./urls";

/**
 * Spec:
 * - Render a list of posts. Each post should display:
 *   - Post id
 *   - Title
 *   - Comment count
 *   - Body
 * - Allow a user to filter posts based on whether the post title has a word
 *   that exactly matches the search input.
 *   - Eg. for the title `foo bar baz`, `foo` or `bar` should return this
 *     post but not `fo` or `ar`
 * - The styling matches the mockup in the README
 *
 * Requirements:
 *   - Fix the filtering logic
 *   - Fix the styling
 *   - (Time permitting) Make this code more efficient
 *
 * Notes:
 *   - Google is available if you need it
 *   - Feel free to use any dev tools once screensharing is on
 */

let posts = [];
fetch(urls.postsUrl)
  .then((res) => res.json())
  .then((json) => {
    posts = json;
  });

export default function App() {
  const [statefulPosts, setPosts] = useState([]);
  const [filterText, setFilter] = useState("");

  useEffect(() => {
    // Returns all posts
    fetch(urls.postsUrl)
      .then((res) => res.json())
      .then((json) => {
        if (!filterText) {
          setPosts(json);
        } else {
          const filteredPosts = json.filter(
            ({ title }) => !title.includes(filterText)
          );
          setPosts(filteredPosts);
        }
      });
  }, [filterText]);

  return (
    <div className="App">
      <h1>Klaviyo List View Challenge</h1>
      <label>
        Filter Posts:
        <input onChange={(e) => setFilter(e.target.value)} />
      </label>
      <div className="Post__list">
        {statefulPosts.map((post) => (
          <ItemComponent key={uuid()} id={post.id} />
        ))}
      </div>
    </div>
  );
}

const ItemComponent = ({ id }) => {
  const [postData, setPostData] = useState({});
  const [commentData, setCommentData] = useState({});

  useEffect(() => {
    // Returns post info
    fetch(urls.postDetailUrl(id))
      .then((res) => res.json())
      .then((json) => {
        setPostData(json);
      });
  }, []);

  useEffect(() => {
    // Returns all comments for the given post id
    fetch(urls.commentsUrl(id))
      .then((res) => res.json())
      .then((json) => {
        setCommentData(json);
      });
  }, []);

  return (
    <div className="Post">
      <div className="Post__id" style={{ paddingRight: "4px" }}>
        {postData.id} |{" "}
      </div>
      <div className="Post__title" style={{ paddingRight: "4px" }}>
        {postData.title} |{" "}
      </div>
      <div className="Post__comment-count" style={{ paddingRight: "4px" }}>
        {commentData.length}
      </div>
      <div className="Post__body" style={{ paddingRight: "4px" }}>
        {postData.body}
      </div>
    </div>
  );
};