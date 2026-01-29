# Agent Setup

Configure the AI Agent in ScriptO Studio.

## Prerequisites

To use the Agent, you need an API key from a supported LLM provider:

| Provider | Models | Get API Key |
|----------|--------|-------------|
| **OpenAI** | GPT-4, GPT-4o, GPT-3.5 | [platform.openai.com](https://platform.openai.com/api-keys) |
| **Anthropic** | Claude 3.5, Claude 3 | [console.anthropic.com](https://console.anthropic.com/settings/keys) |
| **Google** | Gemini Pro | [aistudio.google.com](https://aistudio.google.com/app/apikey) |

## Configuration Steps

1. Open ScriptO Studio
2. Click **Settings** in the sidebar
3. Navigate to **Agent** section
4. Select your **Provider** from the dropdown
5. Enter your **API Key**
6. Select your preferred **Model**
7. Click **Save**

## Settings

| Setting | Description |
|---------|-------------|
| **Provider** | LLM service (OpenAI, Anthropic, Google) |
| **API Key** | Your secret API key |
| **Model** | Specific model to use |
| **Temperature** | Creativity level (0.0 = deterministic, 1.0 = creative) |

## Verify Setup

After configuration:

1. Open the Agent panel (or use keyboard shortcut)
2. Type "Hello, are you working?"
3. You should receive a response

If you see an error, check:
- API key is correct and active
- You have credits/quota with the provider
- Network connection is working

## API Key Security

> [!WARNING]
> Your API key is stored locally in your browser. Never share your API key or commit it to version control.

- Keys are stored in browser localStorage
- Keys are only sent to the configured provider
- Clear browser data to remove stored keys

## Cost Considerations

LLM APIs are billed per token (roughly per word):
- Simple queries: ~$0.001 - $0.01
- Complex code generation: ~$0.05 - $0.20
- Extended conversations: Costs accumulate

Set spending limits with your provider to avoid unexpected charges.

## Related

- [Agent Overview](../agent/index.md)
- [Using the Agent](../agent/usage.md)
