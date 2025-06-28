# Gemini CLI Bridge Server

This bridge server provides an HTTP API for the Go implementation of Gemini CLI to communicate with the Node.js implementation during the gradual migration process.

## Purpose

The bridge server is a key component of our gradual migration strategy from Node.js to Go. It allows us to:

1. Implement components in Go while still leveraging the existing Node.js functionality
2. Validate the Go implementation against the Node.js implementation
3. Maintain a working application throughout the migration process
4. Gradually replace Node.js components with Go equivalents

## API Endpoints

The bridge server provides the following API endpoints:

### Health Check

```
GET /api/health
```

Returns the status of the bridge server.

### Tool Execution

```
POST /api/tools/execute
```

Executes a tool in the Node.js implementation.

Request body:
```json
{
  "name": "tool_name",
  "args": {
    "arg1": "value1",
    "arg2": "value2"
  }
}
```

### Context Building

```
GET /api/context/build
```

Generates a system prompt using the Node.js implementation.

### Command Processing

```
POST /api/commands/process
```

Processes a command using the Node.js implementation.

Request body:
```json
{
  "command": "command_text",
  "type": "slash|at|shell"
}
```

## Usage

### Installation

```bash
npm install
```

### Starting the Bridge Server

```bash
npm start
```

The server will listen on port 3000 by default. You can specify a different port by setting the `PORT` environment variable.

### Using the Bridge Server from Go

The Go implementation can communicate with the bridge server using the `internal/bridge` package. See the `internal/bridge/client.go` file for details.

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test