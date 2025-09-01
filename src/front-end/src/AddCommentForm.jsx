import { useState } from "react";

// eslint-disable-next-line react/prop-types
export default function AddCommentForm({ onAddComment }) {
  const [nameText, setNameText] = useState("");
  const [commentText, setCommentText] = useState("");

  return (
    <div>
      <h3>Add a Comment</h3>
      <label>
        Name:
        <input
          type="text"
          value={nameText}
          onChange={(e) => setNameText(e.target.value)}
        />
      </label>
      <label>
        Comment:
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
      </label>
      <button
        onClick={() => {
          onAddComment({ nameText, commentText });
          setNameText("");
          setCommentText("");
        }}
      >
        Add Comment
      </button>
    </div>
  );
}
