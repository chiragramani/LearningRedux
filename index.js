//// Library code
// When you invoke createStore, it creates the store and passes the initial state to you back.
function createStore(reducer) {
  // The storee should support the following 5 parts.
  // 1. State Tree
  // 2. Get the current state.
  // 3. Listen to changes on the state.
  // 4. Update the state.
  let state;
  let listeners = [];
  const getState = () => state;
  const dispatch = action => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };
  /// Listener or callbacks to be invoked when the state changes.
  /// Returns a function, which when invoked, unsubscribes from state updates.
  const subscribe = listener => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };
  return {
    getState,
    subscribe,
    dispatch
  };
}

//// Reducer functions are specific to business logic, therefore App's code.
function todos(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      return state.concat([action.todo]);
      return state.concat([action.todo]);
    case "REMOVE_TODO":
      return state.filter(todo => todo.id !== action.id);
    case "TOGGLE_TODO":
      return state.map(todo =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      );
    default:
      return state;
  }
}

/// Creating the store and passsing the required reducer functions.
const store = createStore(todos);

const unsubscribe = store.subscribe(() => {
  console.log("The new state is", store.getState());
});

store.dispatch({
  type: "ADD_TODO",
  todo: {
    id: 0,
    content: "Learn Redux"
  }
});
