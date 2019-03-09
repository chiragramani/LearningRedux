// When you invoke createStore, it creates the store and passes the initial state to you back.

function createStore() {
  // The storee should support the following 5 parts.
  // 1. State Tree
  // 2. Get the current state.
  // 3. Listen to changes on the state.
  // 4. Update the state.
  let state = {};

  const getState = () => state;

  return getState;
}
