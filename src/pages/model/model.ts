export interface TodoItem {
  uuid?: String;
  name: String;
  complete?: Boolean
}

export interface TodoList {
  uuid: String;
  name: String;
  items: TodoItem[]
}
