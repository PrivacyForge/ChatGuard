# BrowserStorage Class Documentation

The `BrowserStorage` class provides an abstraction for browser storage operations, supporting both the `chrome.storage.sync` API and the `browser.storage.sync` API. It allows for retrieving and setting data in the browser's synchronized storage.

## Class Structure

### Constructor

```typescript
constructor(defaultStorage: IStorage)
```

- **Parameters:**
  - `defaultStorage`: An instance of `IStorage` representing the default storage configuration.

### Methods

#### `async get(): Promise<IStorage>`

Retrieves data from the browser's synchronized storage.

- **Returns:** A Promise that resolves to the retrieved data.

#### `async set(value: any): Promise<void>`

Sets data in the browser's synchronized storage.

- **Parameters:**

  - `value`: The data to be set.

- **Returns:** A Promise that resolves when the data has been set.

# LocalStorage Class Documentation

The `LocalStorage` class provides an abstraction for local storage operations, allowing for easy retrieval and modification of data stored in the browser's local storage. It also supports listeners for changes to specific data keys.

## Class Structure

### Properties

- `listeners: Record<string, Function>`: Stores callback functions for specific keys to listen for changes.

### Methods

#### `get(key: string): any`

Retrieves data from the local storage for a given key.

- **Parameters:**

  - `key`: The key for the data.

- **Returns:** The retrieved data or `null` if the key does not exist.

#### `set(key: string, value: any): void`

Sets data in the local storage for a given key.

- **Parameters:**

  - `key`: The key for the data.
  - `value`: The data to be set.

- **Returns:** None.

#### `getMap(main: string, key: string): any`

Retrieves a specific value from a map stored in local storage.

- **Parameters:**

  - `main`: The main key for the map.
  - `key`: The sub-key for the desired value within the map.

- **Returns:** The retrieved value or an empty object if the map or key does not exist.

#### `setMap(main: string, key: string, value: any): void`

Sets a specific value in a map stored in local storage.

- **Parameters:**

  - `main`: The main key for the map.
  - `key`: The sub-key for the value within the map.
  - `value`: The data to be set.

- **Returns:** None.

#### `on(main: string, callback: (data: Record<string, any>) => void): void`

Registers a listener callback for changes to a specific main key in local storage.

- **Parameters:**

  - `main`: The main key to listen for changes.
  - `callback`: The callback function to be executed when changes occur.

- **Returns:** None.

## Example Usage

```typescript
import { BrowserStorage, LocalStorage } from "./Storage";
import type { IStorage } from "src/store";

const defaultStorage: IStorage = {
  /* provide default storage configuration */
};
const browserStorage = new BrowserStorage(defaultStorage);
const localStorage = new LocalStorage();

// Example: Using BrowserStorage to get and set data
const dataFromBrowser = await browserStorage.get();
console.log("Data from browser storage:", dataFromBrowser);

const newData = {
  /* new data to be set */
};
await browserStorage.set(newData);
console.log("New data set in browser storage");

// Example: Using LocalStorage to get and set data
const valueFromLocalStorage = localStorage.get("exampleKey");
console.log("Value from local storage:", valueFromLocalStorage);

const newValue = {
  /* new value to be set */
};
localStorage.set("exampleKey", newValue);
console.log("New value set in local storage");

// Example: Using LocalStorage to work with maps and listeners
localStorage.setMap("mapKey", "subKey", "mapValue");

localStorage.on("mapKey", (data) => {
  console.log("Map key changed:", data);
});
```

## Dependencies

None

## Disclaimer

This documentation assumes a certain environment and dependencies. Ensure that the required APIs and functionalities are available and properly configured for the classes to function as intended.
