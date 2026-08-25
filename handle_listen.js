const chalk = require("chalk");
const { handleCommand } = require("./handle_command");

function startListening({ api, commands, config }) {
  api.listenMqtt((err, event) => {
    if (err) {
      console.log(chalk.red("[LISTEN ERROR] " + err.message));
      return;
    }

    switch (event.type) {
      case "message":
      case "message_reply":
        handleCommand({ api, event, commands, config });
        break;

      case "message_reaction":
        break;

      case "event":
        handleThreadEvent({ api, event, config });
        break;

      case "presence":
      case "typ":
      case "read_receipt":
        break;

      default:
        console.log(chalk.gray(`[LISTEN] Unhandled event type: ${event.type}`));
    }
  });

  console.log(chalk.cyan("[LISTEN] Listening for messages and events..."));
}

function handleThreadEvent({ api, event, config }) {
  switch (event.logMessageType) {
    case "log:subscribe": {
      const addedUsers = event.logMessageData?.addedParticipants || [];
      const names = addedUsers.map(u => u.fullName || u.userFbId).join(", ");
      if (names) {
        api.sendMessage(`👋 Welcome ${names}! Type "${config.prefix}help" to see what I can do.`, event.threadID);
      }
      break;
    }

    case "log:unsubscribe": {
      const leftUser = event.logMessageData?.leftParticipantFbId;
      if (leftUser && leftUser !== api.getCurrentUserID()) {
        api.sendMessage("👋 Someone left the chat.", event.threadID);
      }
      break;
    }

    case "log:thread-name": {
      const newName = event.logMessageData?.name;
      if (newName) {
        console.log(chalk.gray(`[EVENT] Thread ${event.threadID} renamed to "${newName}"`));
      }
      break;
    }

    default:
      break;
  }
}

module.exports = { startListening };
