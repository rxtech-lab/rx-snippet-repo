interface Document {
  startViewTransition(updateCallback: () => void): {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
  };
} 