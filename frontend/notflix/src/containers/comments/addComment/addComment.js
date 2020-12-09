import React, { useState } from "react";
import "./addComment.css";
import { Form, Image, TextArea, Button } from "semantic-ui-react";

export default function AddComment() {
  const [value, setValue] = useState("");
  console.log(value);
  return (
    <div>
      <Form>
        <Form.TextArea
          style={commentConatiner}
          className="add-comment"
          value={value}
          onChange={({ target }) => setValue(target.value)}
          placeholder="Add a comment"
        />
      </Form>
      <div className="send-buttons">
        <Button>Cancel</Button>
        <Button
          variant="contained"
          disabled
          className={value != "" ? "send-button-enabled" : ""}
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
