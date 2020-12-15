import React, { useContext, useState } from "react";
import "./addComment.css";
import { addComment } from '../../../components/api/videos';
import { Form, Image, TextArea, Button } from "semantic-ui-react";
import { AuthContext } from "../../../context/auth";

export default function AddComment({ vid, reducer }) {
  const auth = useContext(AuthContext);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(value);

  const handleComment = (e) => {
    e.preventDefault();
    console.log('Update Refresh')
    setLoading(true);
    addComment(vid, auth.state.uid, auth.state.username, value).then((response) => {
      console.log(response);
      setValue("");
      reducer.dispatch({
        type: 'REFRESH'
      });
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }

  return (
    <div>
      <Form onSubmit={handleComment} disabled={loading}>
        <Form.TextArea
          style={commentConatiner}
          className="add-comment"
          value={value}
          onChange={({ target }) => setValue(target.value)}
          placeholder="Add a comment"
        />
      </Form>
      <div className="send-buttons">
        <Button
          onClick={() => {
            setValue("");
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={loading}
          className={value != "" ? "send-button-enabled" : ""}
          onClick={handleComment}
        >
          Comment
        </Button>
      </div>
    </div>
  );
}
const commentConatiner = {
  width: "100%",
  backgroundColor: "rgb(20, 20, 20)",
  color: "white",
};
