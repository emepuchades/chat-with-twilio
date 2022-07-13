import React from "react";
import { ListItem } from "@material-ui/core";

class Messages extends React.Component {
  render() {
    const { message, email } = this.props;
    const isOwnMessage = message.author === email;

    return (
      <ListItem style={styles.listItem(isOwnMessage)}>
        <div style={styles.author}>{message.author}</div>
        <div style={styles.container(isOwnMessage)}>
          {message.body}
        </div>
        <div style={styles.timestamp}>
            {new Date(message.dateCreated.toISOString()).toLocaleString()}
          </div>
      </ListItem>
    );
  }
}

const styles = {
  listItem: (isOwnMessage) => ({
    flexDirection: "column",
    alignItems: isOwnMessage ? "flex-end" : "flex-start",
  }),
  container: (isOwnMessage) => ({
    maxWidth: "75%",
    borderRadius: 12,
    padding: 16,
    color: isOwnMessage ? "white" : "black",
    fontSize: 14,
    backgroundColor: isOwnMessage ? "#1A233B" : "white",
  }),
  author: { fontSize: 14, color: "gray" },
  timestamp: { fontSize: 10, color: "gray", textAlign: "right", paddingTop: 4 },
};

export default Messages;