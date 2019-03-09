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
  };
}
function addTodoToggleAction(id) {
  return {
    type: TOGGLE_TODO,
    id
  };
}
function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal
  };
}
function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id
  };
}

//// Reducer functions are specific to business logic, therefore App's code.
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id !== action.id
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
      return state.filter(aGoal => aGoal.id !== action.id);
    default:
      return state;
  }
  return state;
}

/// Middleware.
const checker = store => next => action => {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().includes("bitcoin")
  ) {
    return alert("Nope. Buying Bitcoin is not a good idea at the moment");
  }
  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().includes("bitcoin")
  ) {
    return alert("Nope. Buying Bitcoin is not a good idea at the moment");
  }
  return next(action);
};

const logger = store => next => action => {
  console.group(action.type);
  console.log("The action is:", action);
  const result = next(action);
  console.log("The new state is: ", store.getState());
  console.groupEnd();
  return next(action);
};

const middleWares = [logger, checker];

/// Creating the store and passsing the required reducer functions.
const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals
  }),
  Redux.applyMiddleware(...middleWares)
);

const unsubscribe = store.subscribe(() => {
  document.getElementsByClassName("todos")[0].innerHTML = "";
  document.getElementsByClassName("goals")[0].innerHTML = "";
  //
  const { todos, goals } = store.getState();
  todos.forEach(todo => addTodoToDOM(todo));
  goals.forEach(goal => addGoalToDOM(goal));
});

function generateId() {
  return (
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36)
  );
}

function createRemoveButton(onClick) {
  const removeButton = document.createElement("button");
  removeButton.innerHTML = "X";
  removeButton.addEventListener("click", onClick, false);
  return removeButton;
}

function addTodoToDOM(todo) {
  const todosList = document.getElementsByClassName("todos")[0];
  const node = document.createElement("li");
  const textNode = document.createTextNode(todo.name);
  node.appendChild(textNode);
  node.style.textDecoration = todo.complete ? "line-through" : "none";
  const removeButton = createRemoveButton(() => {
    store.dispatch(removeTodoAction(todo.id));
  });
  node.appendChild(removeButton);
  todosList.appendChild(node);
  node.addEventListener("click", () => {
    console.log("asassas");
    store.dispatch(addTodoToggleAction(todo.id), false);
  });
}

function addGoalToDOM(goal) {
  /// Adding the list element
  const goalList = document.getElementsByClassName("goals")[0];
  const newGoalListElement = document.createElement("li");
  newGoalListElement.textContent = goal.name;
  /// Remove button
  const removeButton = createRemoveButton(() => {
    store.dispatch(removeGoalAction(goal.id));
  });
  newGoalListElement.appendChild(removeButton);
  goalList.appendChild(newGoalListElement);
}

function addTodo() {
  const todoInput = document.getElementById("todo");
  const currentText = todoInput.value;
  todoInput.value = "";
  const todo = {
    id: generateId(),
    name: currentText,
    complete: false
  };
  store.dispatch(addTodoAction(todo));
}

function addGoal() {
  const goalInput = document.getElementById("goal");
  const currentText = goalInput.value;
  goalInput.value = "";
  const goal = {
    id: generateId(),
    name: currentText
  };
  // checkAndDispatch(store, addGoalAction(goal)); But this is not a middleware.
  store.dispatch(addGoalAction(goal));
}

function listenToTodoClick() {
  const addTodoButton = document.getElementById("todoBtn");
  addTodoButton.addEventListener("click", () => {
    addTodo();
  });
}

function listenToGoalClick() {
  const addGoalButton = document.getElementById("goalBtn");
  addGoalButton.addEventListener("click", () => {
    addGoal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  this.listenToTodoClick();
  this.listenToGoalClick();
});
