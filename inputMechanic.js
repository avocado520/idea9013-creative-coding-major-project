class InputMechanic {
  handleKeyPressed(keyValue) {
    if (keyValue === ' ') {
      createNewTree(); // Type space to create a new tree
    }
  }
}

let inputMechanic = new InputMechanic();