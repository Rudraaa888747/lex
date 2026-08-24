// 🚩 PLACEHOLDER PRICING — NOT real OpenRouter pricing.
//
// The app currently calls model "openai/gpt-4o-mini" through the OpenRouter
// API (see src/services/ai.service.ts -> MODEL). The value below is a clearly
// labeled placeholder estimate and should be replaced with the ACTUAL USD cost
// per 1,000 tokens for that model once confirmed from OpenRouter's pricing page.
//
// Total estimated cost is computed as: (totalTokens / 1000) * COST_PER_1K_TOKENS
export const COST_PER_1K_TOKENS = 0.00015;
