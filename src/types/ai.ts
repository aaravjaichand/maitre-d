/** A message in an LLM conversation */
export interface Message {
  /** Role of the message author */
  role: 'system' | 'user' | 'assistant';
  /** Text content of the message */
  content: string;
}

/** Request payload for an LLM completion */
export interface CompletionRequest {
  /** Conversation messages to send to the model */
  messages: Message[];
  /** Sampling temperature (higher = more creative, lower = more deterministic) */
  temperature?: number;
  /** Maximum number of tokens to generate */
  maxTokens?: number;
  /** Structured output format specification */
  responseFormat?: ResponseFormat;
}

/** Response from an LLM completion */
export interface CompletionResponse {
  /** Generated text content */
  content: string;
  /** Token usage statistics */
  usage: {
    /** Number of input tokens consumed */
    inputTokens: number;
    /** Number of output tokens generated */
    outputTokens: number;
  };
  /** Reason the model stopped generating */
  finishReason: 'stop' | 'length' | 'tool_use';
}

/** Specification for structured JSON output from the model */
export interface ResponseFormat {
  /** Format type (currently only JSON schema is supported) */
  type: 'json_schema';
  /** JSON schema that the model output must conform to */
  schema: Record<string, unknown>;
}

/** Common interface for all LLM provider adapters */
export interface LLMProvider {
  /** Unique provider identifier (e.g., 'openai', 'anthropic', 'google', 'ollama') */
  readonly id: string;
  /** Human-readable provider name */
  readonly name: string;

  /** Check if this provider is configured and reachable */
  isAvailable(): Promise<boolean>;
  /** Send a completion request and return the full response */
  complete(request: CompletionRequest): Promise<CompletionResponse>;
  /** Send a streaming completion request, yielding text chunks */
  stream(request: CompletionRequest): AsyncIterable<string>;
}
