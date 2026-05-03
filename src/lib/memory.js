/**
 * Centralized Memory Management for Chat Intents
 * Handles semantic preservation, deep merging, & structured state
 */

export const CONVERSATION_STATES = {
  DISCOVERY: 'discovery',
  REFINING: 'refining',
  RECOMMENDING: 'recommending',
  COMPARING: 'comparing',
  DONE: 'done'
};

export function updateMemory(previousIntent = {}, newIntent = {}) {
  // Deep merge base fields
  const merged = {
    ...previousIntent,
    ...newIntent,
    missingFields: newIntent.missingFields || getMissingFields({...previousIntent, ...newIntent}),
    confidence: newIntent.confidence !== undefined ? newIntent.confidence : previousIntent.confidence || 0.3,
    // 🔥 STRUCTURED STATE
    feedbackScores: {
      up: previousIntent.feedbackScores?.up || [],
      down: previousIntent.feedbackScores?.down || []
    },
    turnsSinceUpdate: (previousIntent.turnsSinceUpdate || 0) + 1,
    state: determineState({...previousIntent, ...newIntent}),
  };

  // 🔥 CRITICAL: Preserve category semantically
  if (!merged.category && previousIntent.category) {
    const contextual = newIntent.maxBudget || newIntent.useCase || newIntent.audioType || 
                      newIntent.concern || newIntent.skillLevel || 
                      /gaming|music|call|cheap|under|mom|daily/.test(newIntent.rawText || '');
    if (contextual) {
      merged.category = previousIntent.category;
      merged.missingFields = getMissingFields(merged);
    }
  }

  // 🔥 Budget normalization/expansion fallback
  if (merged.maxBudget && !newIntent.maxBudget) {
    merged._budgetInherited = true;
  } else if (newIntent.maxBudget) {
    merged.maxBudget = Math.round(newIntent.maxBudget);
    delete merged._budgetInherited;
  }

  // 🔥 Use case preservation
  if (!merged.useCase && previousIntent.useCase && newIntent.maxBudget) {
    merged.useCase = previousIntent.useCase;
  }

  // Deep merge signals
  if (previousIntent.signals && newIntent.signals) {
    merged.signals = { ...previousIntent.signals, ...newIntent.signals };
  }

  // Timestamp
  merged.lastUpdated = Date.now();

  return merged;
}

// 🔥 STATE MACHINE
function determineState(intent) {
  if (intent.intentType === 'greeting') return CONVERSATION_STATES.DISCOVERY;
  if (intent.missingFields?.length > 0) return CONVERSATION_STATES.REFINING;
  if (intent.lastProducts?.length > 0) return CONVERSATION_STATES.RECOMMENDING;
  if (intent.intentType === 'comparison') return CONVERSATION_STATES.COMPARING;
  return CONVERSATION_STATES.DONE;
}

export function getMissingFields(intent) {
  // Respect state - no questions in DONE
  if (intent.state === CONVERSATION_STATES.DONE) return [];

  const missing = [];
  const { category, audioType, useCase, concern, skillLevel, maxBudget } = intent;

  if (!category) {
    missing.push("category");
    return missing;
  }

  switch (category) {
    case 'audio':
      if (!audioType) missing.push('audioType');
      if (!useCase) missing.push('useCase');
      break;
    case 'skincare':
      if (!concern) missing.push('concern');
      break;
    case 'snowboards':
      if (!skillLevel) missing.push('skillLevel');
      break;
    case 'gift':
      if (!maxBudget) missing.push('budget');
      break;
  }

  return missing;
}

export function getCurrentState(intent) {
  return intent.state || CONVERSATION_STATES.DISCOVERY;
}

// Reset
export function resetMemory() {
  return {
    state: CONVERSATION_STATES.DISCOVERY,
    missingFields: ['category'],
    confidence: 0.3,
    feedbackScores: { up: [], down: [] }
  };
}

export function addFeedback(memory, productId, isUp) {
  const scores = memory.feedbackScores || { up: [], down: [] };
  const list = isUp ? scores.up : scores.down;
  list.push({ productId, timestamp: Date.now() });
  return { ...memory, feedbackScores: scores };
}

export default { 
  updateMemory, 
  resetMemory, 
  getMissingFields, 
  getCurrentState,
  addFeedback,
  CONVERSATION_STATES 
};

