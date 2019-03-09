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

const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";

/// Action Creators
function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo
  }
}
function removeTodoAction(todo) {
  return  {
    type: REMOVE_TODO,
    id
  }
}

//// Reducer functions are specific to business logic, therefore App's code.
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.todo.id);
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id !== action.todo.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      );
    default:
      return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter(aGoal => aGoal.id !== action.goal.id);
    default:
      return state;
  }
  return state;
}

function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action)
  };
}

/// Creating the store and passsing the required reducer functions.
const store = createStore(app);

const unsubscribe = store.subscribe(() => {
  console.log("The new state is", store.getState());
});
