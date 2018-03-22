export interface TodoItem {
  uuid?: String;
  name: String;
  complete?: Boolean;
  imgDataUrl?: String
}

export interface TodoList {
  uuid: String;
  name: String;
  items: TodoItem[]
}
