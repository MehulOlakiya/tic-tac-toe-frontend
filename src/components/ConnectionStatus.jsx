import "./ConnectionStatus.css"

function ConnectionStatus({ connected }) {
  return (
    <div className={`connection-status ${connected ? "success" : "error"}`}>
      {connected ? "Connected to server" : "Connecting to server..."}
    </div>
  )
}

export default ConnectionStatus
