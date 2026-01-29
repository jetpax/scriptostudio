# Agent Overview

ScriptO Studio includes an AI-powered coding agent that helps you write, debug, and optimize MicroPython code for your device.

![AI Agent](../assets/AI.png)

## What is the Agent?

The Agent is an AI assistant integrated into ScriptO Studio that can:
- **Generate code** from natural language descriptions
- **Explain code** and device behavior
- **Debug issues** by analyzing errors and logs
- **Suggest optimizations** for performance and memory
- **Answer questions** about MicroPython and ESP32

## How It Works

The Agent uses large language models (LLMs) to understand your requests and generate appropriate responses. It has context about:
- Your device configuration
- Currently open files
- Recent terminal output
- Error messages

## Features

| Feature | Description |
|---------|-------------|
| **Code Generation** | Describe what you want, get working code |
| **Error Analysis** | Paste an error, get an explanation and fix |
| **Device Awareness** | Knows your board's pins and capabilities |
| **Context Retention** | Remembers conversation history |

## Getting Started

See [Agent Setup](../agent/setup.md) to configure the agent with your API key.

See [Using the Agent](../agent/usage.md) for usage examples.

## Privacy

The Agent sends your prompts and relevant context to the configured LLM provider. Review your provider's privacy policy for details on data handling.

## Related

- [Agent Setup](../agent/setup.md)
- [Using the Agent](../agent/usage.md)
