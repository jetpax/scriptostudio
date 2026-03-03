# Changelog

## v6.0.0 — Streaming

### Highlights

- **🔴 C-Native SSE Streaming** — Server-Sent Events streaming implemented at the C module level (`httpclient`) for real-time LLM token delivery. SSE frames are parsed in the ESP-IDF HTTP event handler and delivered to MicroPython via a ring buffer, enabling progressive response delivery with minimal latency.
- **Event-Driven Agent Loop** — Agent `run_loop()` now supports an `on_reply` callback for immediate delivery of assistant responses as they arrive, replacing the previous request-response pattern.
- **Streaming-First Provider** — `call_chat_stream()` supports both Gemini (`?alt=sse`) and OpenAI-compatible (`stream:true`) endpoints with automatic fallback to standard HTTP.

### Technical Details

- `modhttpclient.c`: Ring buffer for SSE frames, `_poll_chunk()` API, slot lifecycle management for concurrent streaming + polling requests
- `httpclient.py`: Callback-based `stream()` wrapper with drain-after-poll and explicit slot cleanup
- `providers/__init__.py`: Delta normalization for Gemini and OpenAI SSE formats

---

!!! note "Earlier Versions"
    Changelog entries for earlier versions are under construction.
