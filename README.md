# vuex-multi-history

[![Build Status](https://travis-ci.com/Veake/vuex-multi-history.svg?token=Bg4GBGTdq9xroxnkokv8&branch=master)](https://travis-ci.com/Veake/vuex-multi-history)

(Multi-) History for Vuex

## Getting Started

1.  `npm install vue vuex vuex-history-plugin`  
    or \
    `yarn install vue vuex vuex-history-plugin`

2.  Initialize the plugin:

    ```typescript
    import { VuexMultiHistory } from 'vuex-multi-history';
    ...

    const options = {};
    const vuexHistory = new VuexMultiHistory(options);
    ```

3.  Register the plugin in the store:

    ```typescript
    import { Store } from 'vuex';

    ...

    new Store({
           ...

           plugins: [vuexHistory.plugin],
    });
    ```

## Table of Contents

- [Getting Started](#getting-started)
- [Table of Contents](#table-of-contents)
- [Usage](#usage)
  - [Initializing a single history](#initializing-a-single-history)
  - [Initializing multiple histories](#initializing-multiple-histories)
  - [Using a history](#using-a-history)
- [Options](#options)
  - [HistoriesOptions](#historiesoptions)
  - [TransformOptions](#transformoptions)
- [Types](#types)
  - [Store](#store)
  - [VuexMultiHistory](#vuexmultihistory)
    - [Constructor](#constructor)
    - [Properties](#properties)
    - [Methods](#methods)
  - [VuexHistory](#vuexhistory)
    - [Properties](#properties-1)
    - [Methods](#methods-1)
  - [Functions](#functions)
    - [FilterFunction](#filterfunction)
    - [AllocateFunction](#allocatefunction)
    - [SerializeFunction](#serializefunction)
    - [DeserializeFunction](#deserializefunction)
- [Docs](#docs)

## Usage

### Initializing a single history

By default a single history will be initialized if you do not modify the `histories`-object of the options of [`VuexMultiHistory`](#vuexmultihistory), which can be either done by passing it to the constructor or setting it manually.

Example:

```typescript
const vuexHistory = new VuexMultiHistory();
```

### Initializing multiple histories

It is possible to initialize multiple histories. This can be done by modifying the `histories`-object of the options of [`VuexMultiHistory`](#vuexmultihistory), which can be either done by passing it to the constructor or setting it manually.

For each key of `histories.keys` a history will be created, which will also be accessible by the given key. \
Also `histories.allocate` has to be provided, which is of the type [`AllocateFunction`](#allocatefunction) and used to determine to which histories the entry will be added.
You can read more about the [`AllocateFunction`](#allocatefunction) [here](#allocatefunction).

Example:

```typescript
const vuexHistory = new VuexMultiHistory({
  histories: {
    allocate: (mutation) => {
      return mutation.type === 'someType' ? ['historyA'] : ['historyB'];
    },
    keys: ['historyA', 'historyB'],
  },
});
```

> The store that uses the plugin will have two separate histories: 'historyA' and 'historyB'

### Using a history

Now anywhere in the code, where the Vuex-`Store` that uses this plugin is accessible, the `Store`'s `history`-method can be used. \
The `history`-method has the following signature:

```typescript
history(historyKey?: string): VuexHistory;
```

> **INFO**:
>
> - If you do not pass a historyKey the plugin will assume that you mean the first key declared in `histories.keys`.
> - If you pass a key that is not declared in `histories.keys` an error will be thrown because this is a logical error.

After retrieving a [`VuexHistory`](#vuexhistory)-instance you can use it's methods and access it's properties which are listed [here](#vuexhistory).

Example:

```typescript
this.$store.history('historyKey').undo();
```

## Options

Options can be passed to the constructor of [`VuexMultiHistory`](#vuexmultihistory). The type of these options is [`VuexMultiHistoryOptions`](#options).

The available options are listed in the tables below:

> \* default values written in related object

| key       | type                                | default | description                                                                                            |
| --------- | ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| size      | `number`                            |         | Maximum amount of entries a history can hold. If the maximum is reached the first one will be removed. |
| filter    | [`FilterFunction`](#filterfunction) |         | Determines whether the given mutation is supported                                                     |
| histories | `HistoriesOptions`                  | \*      | Options related to the histories                                                                       |
| transform | `TransformOptions`                  | \*      | Options related to serializing and deserializing state-data                                            |

> All the options above are optional

<br/>

#### HistoriesOptions
The options beneath are required when the `histories`-object is passed.

| key      | type                                    | default                               | description                                                    |
| -------- | --------------------------------------- | ------------------------------------- | -------------------------------------------------------------- |
| allocate | [`AllocateFunction`](#allocatefunction) | returns first key of `histories.keys` | Determines which history/histories an entry should be added to |
| keys     | `string[]`                              | `['default']`                         | For each given key a separate history will be created          |

<br/>

#### TransformOptions
The options beneath are required when the `transform`-object is passed.

| key         | type                                          | default                      | description                                                           |
| ----------- | --------------------------------------------- | ---------------------------- | --------------------------------------------------------------------- |
| serialize   | [`SerializeFunction`](#serializefunction)     | returns complete state       | Reduces the state-object when it will be added to the history         |
| deserialize | [`DeserializeFunction`](#deserializefunction) | returns complete entry-state | Will be used to merge the reduced state-object with the current state |

## Types

### Store

The plugin adds a method with the signature `history(historyKey?: string): VuexHistory` to the prototype of `Store`. \
That makes is possible to call `store.history()` or `store.history(key)` to retrieve a [`VuexHistory`](#vuexhistory).

> **INFO**:
>
> - If you do not pass a historyKey the plugin will assume that you mean the first key declared in `histories.keys`.
> - If you pass a key that is not declared in `histories.keys` an error will be thrown because this is a logical error.

### VuexMultiHistory

A [`VuexMultiHistory`](#vuexmultihistory)-object has the following constructor, properties and methods:

#### Constructor

The options that can be passed to the plugin are listed [here](#options). \
The constructor has the following signature:

```typescript
new (options: Partial<VuexMultiHistoryOptions>): VuexMultiHistory;
```

<br/>

#### Properties

All properties are `readonly` and cannot be replaced.

| key     | type                                             | description                                                                       |
| ------- | ------------------------------------------------ | --------------------------------------------------------------------------------- |
| options | [`VuexMultiHistoryOptions`](#options)            | read more [here](#options)                                                        |
| data    | `{ historyMap: { [key: string]: VuexHistory } }` | keeps track of the histories                                                      |
| plugin  | `VuexPlugin`                                     | plugin-instance that has to be added `plugins` when initializing the Vuex-`Store` |

<br/>

#### Methods

For all these methods the `historyKey` will be the first key in `histories.keys` of the options.

| signature                                          | description                                                                                                               |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `getHistory(historyKey?: string): VuexHistory`     | returns the [`VuexHistory`](#vuexhistory) with the given key; if there is no history for the key, an error will be thrown |
| `serialize(historyKey?: string, state: any): any`  | serializes the given state, you can read more [here](#serializefunction)                                                  |
| `deserialize(historyKey?: string, data: any): any` | deserialized the given data to a state, you can read more [here](#deserializefunction)                                    |

### VuexHistory

A [`VuexHistory`](#vuexhistory)-object has the following properties and methods:

#### Properties

| key          | type   | description                                                                        |
| ------------ | ------ | ---------------------------------------------------------------------------------- |
| length       | number | returns the amount of entries the history has                                      |
| index        | number | returns the index the history is currently at                                      |
| initialState | any    | returns the initial state of the history; the result is automatically deserialized |

<br/>

#### Methods

| signature                                                                | description                                                                                                                                               |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `addEntry(entry: HistoryEntry): VuexHistory`                             | adds an entry to the history                                                                                                                              |
| `getEntry(index: number): HistoryEntry`<code>&#124;</code>`undefined`    | returns a copy of an entry of the history                                                                                                                 |
| `removeEntry(index: number): HistoryEntry`<code>&#124;</code>`undefined` | deletes an entry of the history                                                                                                                           |
| `updateEntry(index: number, newEntry: HistoryEntry): VuexHistory`        | updates an entry of the history                                                                                                                           |
| `addEntry(entry: HistoryEntry): VuexHistory`                             | adds an entry to the history                                                                                                                              |
| `addEntry(entry: HistoryEntry): VuexHistory`                             | adds an entry to the history                                                                                                                              |
| `canUndo(): boolean`                                                     | returns if undo is possible                                                                                                                               |
| `canUndo(): boolean`                                                     | returns if undo is possible                                                                                                                               |
| `undo(): VuexHistory`                                                    | undoes the last entry                                                                                                                                     |
| `canRedo(): boolean`                                                     | returns if redo is possible                                                                                                                               |
| `redo(): VuexHistory`                                                    | redoes the next possible entry                                                                                                                            |
| `hasChanges(): boolean`                                                  | returns if there are any entries                                                                                                                          |
| `overrideInitialState(state): VuexHistory`                               | overrides the initial state                                                                                                                               |
| `clearHistory(overrideInitialState = true): void`                        | clears the history and by default overrides the initial state, this flag can be set to `false` to avoid overriding                                        |
| `reset(): void`                                                          | clears the history and replaces the current state with the initial                                                                                        |
| `serialize(state: any): any`                                             | gives access to the [`SerializeFunction`](#serializefunction); should be used when manually adding an entry; you can read more [here](#serializefunction) |
| `deserialize(data: any): void`                                           | gives access to the [`DeserializeFunction`](#deserializefunction); you can read more [here](#deserializefunction)                                         |

### Functions

Every function will be called with having `this` set to the instance of [`VuexMultiHistory`](#vuexmultihistory), this way the functions have access to properties and methods of [`VuexMultiHistory`](#vuexmultihistory).

#### FilterFunction

A [`FilterFunction`](#filterfunction) has the following signature:

```typescript
(mutation: MutationPayload): boolean;
```

The aim of this function is to determine whether the given `mutation` is allowed to be added to any history or not. \
If the function returns `true`, it will be added, if it returns `false` the mutation will not processed any further and not added to any history.

#### AllocateFunction

The [`AllocateFunction`](#allocatefunction) is called after the [`FilterFunction`](#filterfunction) if it returned `true` or if the `filter` in the options was explicitly set to `undefined` or `null`. \
It has the following signature:

```typescript
(mutation: MutationPayload): string[];
```

The aim of this function is to determine, based on the `mutation`, to which histories the entry will be added.
The returned strings should be those or a subset of those, that are in the options in `histories.keys`.

> **INFO**:
>
> If a key is returned that is not in `histories.keys` an error will be thrown, because this is a logical error.

#### SerializeFunction

The [`SerializeFunction`](#serializefunction) is called when an entry is about to be saved. It determines which data will be saved in the entry and can be used to reduce the stored data drastically, as well as making it possible to just replace parts of the state. \
It has the following signature:

```typescript
(historyKey: string, state: any): any;
```

#### DeserializeFunction

The [`DeserializeFunction`](#deserializefunction) is called when the data of an entry is taken to update the current state and it is supposed to rebuild the state of the entry by merging the current state with the data. \
This way not the whole state will be brought back to it's state of the entry. \
It has the following signature:

```typescript
(historyKey: string, data: any): any;
```

## Docs

You can take a look at the docs [here](../blob/master/docs) for in-depth type-declarations.
