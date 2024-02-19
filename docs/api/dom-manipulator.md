# DomManipulator Class Documentation

The `DomManipulator` class facilitates dynamic manipulation of the DOM (Document Object Model) by providing methods for rendering elements, event handling, observing mutations, and more. This class is designed to enhance the interactivity and responsiveness of web applications.

## Class Structure

### Constructor

```typescript
constructor(main: HTMLElement, storage: LocalStorage)
```

- **Parameters:**
  - `main`: The main HTMLElement to observe for mutations and events.
  - `storage`: An instance of `LocalStorage` for managing local storage.

### Properties

- `renderMap: Record<string, RenderMap>`: Stores information about elements to be rendered.
- `url: Url`: Represents the current URL path and its parameters.
- `eventsListener: Record<string, ((e: Event) => void)[]>`: Manages event listeners for elements.
- `observerCalls: MutationCallback[]`: Stores global mutation observer callbacks.
- `clickMap: Record<string, Function[]>`: Manages click event callbacks.

### Methods

#### `renderTo(name: string, parent: string, renderCallback: (parent: HTMLElement) => void): void`

Defines an element to be rendered and specifies its rendering callback.

- **Parameters:**
  - `name`: The identifier for the element.
  - `parent`: The selector for the parent element.
  - `renderCallback`: The callback function for rendering the element.

#### `on(selector: string, name: string, callback: (event: Event) => void): void`

Registers an event listener for the specified event type on the latest element matching the selector.

- **Parameters:**
  - `selector`: The selector for the target element.
  - `name`: The event type (e.g., "click", "change").
  - `callback`: The callback function to be executed when the event occurs.

#### `observe(app: HTMLElement, callback: MutationCallback): void`

Sets up a mutation observer on the provided element.

- **Parameters:**
  - `app`: The HTMLElement to observe.
  - `callback`: The callback function to be executed when mutations are observed.

#### `observerGlobal(callback: MutationCallback): void`

Registers a global mutation observer callback. This callback will be executed for mutations on the main element.

- **Parameters:**
  - `callback`: The global mutation observer callback function.

#### `urlObserver(mutate: (url: string) => void): void`

Observes changes in the URL and invokes the provided callback when the URL changes.

- **Parameters:**
  - `mutate`: The callback function to be executed when the URL changes.

#### `destroyed(name: string): void`

Marks an element as not rendered, allowing it to be re-rendered in the future.

- **Parameters:**
  - `name`: The identifier of the element to mark as not rendered.

#### `changeTextNode(element: HTMLElement, replace: string): void`

Replaces the text content of a text node within the specified element.

- **Parameters:**
  - `element`: The HTMLElement containing the text node.
  - `replace`: The new text content to set.

#### `onClick(selector: string, callback: Function): void`

Registers a callback function to be executed when elements matching the selector are clicked.

- **Parameters:**
  - `selector`: The selector for the target elements.
  - `callback`: The callback function to be executed on click.

#### `static async getElement<T>(selector: string): Promise<T>`

Waits for an element matching the provided selector to be present in the DOM and returns the element.

- **Parameters:**

  - `selector`: The selector for the target element.

- **Returns:** A Promise that resolves to the HTMLElement.

#### `static async typeTo(selector: string, message: string): Promise<void>`

Simulates typing the provided message into an input element.

- **Parameters:**

  - `selector`: The selector for the input element.
  - `message`: The message to be typed.

- **Returns:** A Promise that resolves when the typing simulation is complete.

#### `static async wait(ms: number): Promise<void>`

Waits for the specified duration in milliseconds.

- **Parameters:**

  - `ms`: The duration to wait in milliseconds.

- **Returns:** A Promise that resolves after the specified duration.

#### `static async clickTo(selector: string): Promise<void>`

Simulates a click on the element matching the provided selector.

- **Parameters:**

  - `selector`: The selector for the target element.

- **Returns:** A Promise that resolves after the click simulation.

## Example Usage

```typescript
import { DomManipulator } from "./DomManipulator";
import { chromeStorage } from "src/store";
import { LocalStorage } from "src/class/Storage";

const mainElement = document.getElementById("app"); // Replace "app" with the actual ID
const storage = new LocalStorage(); // assuming LocalStorage class is available

const domManipulator = new DomManipulator(mainElement, storage);

// Example: Rendering an element
domManipulator.renderTo("exampleElement", "#parentElement", (parentElement) => {
  // Render logic for the element
});

// Example: Adding a click event listener
domManipulator.on(".clickable-element", "click", (event) => {
  // Event handling logic
});

// Example: Observing mutations on the main element
domManipulator.observe(mainElement, (mutations) => {
  // Mutation handling logic
});

// Example: Observing global mutations
domManipulator.observerGlobal((mutations) => {
  // Global mutation handling logic
});

// Example: Observing URL changes
domManipulator.urlObserver((url) => {
  // URL change handling logic
});

// Example: Simulating typing into an input element
await DomManipulator.typeTo("#inputElement", "Hello, World!");

// Example: Waiting for a specified duration
await DomManipulator.wait(1000);

// Example: Simulating a click on an element
await DomManipulator.clickTo("#clickableElement");
```

## Dependencies

None

## Disclaimer

This documentation assumes a certain environment and dependencies. Ensure that the required libraries and APIs are available and properly configured for the class to function as intended.
