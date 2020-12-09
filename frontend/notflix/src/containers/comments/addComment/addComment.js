import React, { useState } from "react";
import "./addComment.css";
import { Form, Image, TextArea, Button } from "semantic-ui-react";

export default function AddComment() {
  const [value, setValue] = useState("");
  const [hide, setHide] = useState(false);
  console.log(value);

  return (
    <div>
      <Form>
        <Form.TextArea
          onClick={() => setHide(true)}
          style={commentConatiner}
          className="add-comment"
          value={value}
          onChange={({ target }) => setValue(target.value)}
          placeholder="Add a comment"
        />
      </Form>
      {hide && (
        <div className="send-buttons">
          <Button
            onClick={() => {
              setHide(false);
              setValue("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled
            className={value != "" ? "send-button-enabled" : ""}
          >
            Comment
          </Button>
        </div>
      )}
    </div>
  );
}
const commentConatiner = {
  width: "100%",
  backgroundColor: "rgb(20, 20, 20)",
  color: "white",
};
