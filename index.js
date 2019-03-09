//// Library code
// When you invoke createStore, it creates the store and passes the initial state to you back.
function createStore(reducer) {
  // The storee should support the following 5 parts.
  // 1. State Tree
  // 2. Get the current state.
  // 3. Listen to changes on the state.
  // 4. Update the state.
  let state
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
      state = reducer(state, action);
      listeners.forEach((listener) => listener());
  }

  /// Listener or callbacks to be invoked when the state changes.
  /// Returns a function, which when invoked, unsubscribes from state updates.
  const subscribe = listener => {
    listeners.push(callback);
    return () => {
        listeners = listeners.filter(l => l !== listener)
    }
  };

  return {
    getState,
    subscribe,
    dispatch
  };
}

//// Reducer functions are specific to business logic, therefore App's code. 
function todos(state = [], action) {
    if (action.type === 'ADD_TODO') {
        return state.concat([action.todo])
    }
    return state;
}

// const store = createStore(todos);

// const unsubscribe = store.subscribe(() => {
//   console.log("The new state is", store.getState());
// });


