# Journey Builder React Coding Challenge

## Overview

This project reimplements a portion of the Journey Builder app by Avantos, focusing on a node-based UI that represents a Directed Acyclic Graph (DAG) of forms. The app allows form data from previous forms to prefill subsequent forms in a workflow.

## Features

- **Node-based UI**: Display nodes and edges based on data fetched from the `action-blueprint-graph-get` API.
- **Form Prefill**: View and edit prefill mappings for form fields, where values from one form can populate fields in downstream forms.
- **Data Sources**:
  - Form fields from directly and transitively dependent forms.
  - Global data .

## Installation

1. **Clone this repository and install dependencies:**

   ```bash
   git clone https://github.com/seanmcgowanx/577f49
   cd 577f49
   npm install
   ```

2. **Start the mock API server:**

   The mock server (`frontendchallengeserver`) is expected to be located in the root directory of your project. If it's already cloned:

   ```bash
   cd frontendchallengeserver
   npm install
   npm start
   ```

   This will start the mock server on [http://localhost:3002](http://localhost:3002).

3. **Start the development server:**

   In a separate terminal, return to the main project folder and run:

   ```bash
   cd 577f49
   npm start
   ```

   This will start the development server on [http://localhost:3000](http://localhost:3000).

4. **Access the app:**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Runing Tests

**Run the core functionality tests for this application**

```bash
npm test
```

## How to Extend the Project with New Data Sources

**Adding New Global Data Sources**

To extend the project with new global data sources, follow these steps:

1. Navigate to the `/src/services/globalData` directory in your project.
2. In this file, you will find a `globalData` variable where existing global data sources are stored.
3. Add your new global data source object to the `globalData` variable. 
   - Each new data source should contain:
     - **`label`**: A string that represents the label for the data source.
     - **`fields`**: An array of strings that represents the field names associated with the data source.

Example of how to add a new global data source in TypeScript:
```typescript
interface GlobalDataSource {
  label: string;
  fields: string[];
}

const newGlobalData: GlobalDataSource = {
  label: "New Global Data Source",
  fields: ["field1", "field2", "field3"],
};

globalData.push(newGlobalData);

**Adding New Form Nodes**

To extend the project with new form nodes, follow these steps:

1. **API Update**: The API must be updated to include new form nodes, edges, and forms. This involves adding the new form nodes and defining the relationships (edges, forms) between them in the API.
2. **Code Handling**: Once the API is updated with the new form nodes, the existing frontend code will automatically handle the rendering and prefill logic for the new nodes and forms. No further code changes are needed in the frontend for the new form nodes to be supported.
```
## What patterns should I be paying attention to?

When reviewing the project, the following patterns are crucial to focus on to ensure maintainability, scalability, and clean code practices:

### 1. **Component Composition and Modularity**
   - **Pattern to focus on:** React’s component-based architecture encourages breaking down the application into reusable, self-contained components. Look for well-structured components that follow the single responsibility principle.
   - **Why it's important:** Components that handle distinct concerns can be easily reused and extended. This modularity supports maintainability and allows for the independent scaling of features.

### 2. **Declarative UI and State Management**
   - **Pattern to focus on:** The use of **React’s declarative approach** to UI, where the state determines the rendered output, and the UI automatically updates when the state changes.
   - **Why it's important:** This ensures that the application is predictable, with clear mappings of state to the UI. A good pattern for state management ensures the code is easy to follow and less prone to bugs.

### 3. **Extensibility for New Features**
   - **Pattern to focus on:** **Extensibility** in how new form nodes, data sources, and mappings can be added without requiring major changes to existing logic.
   - **Why it's important:** This reflects the flexibility of the codebase. Adding new functionality should involve minimal changes, preserving existing functionality while allowing for future growth. 

### 4. **Type Safety and TypeScript Usage**
   - **Pattern to focus on:** **Effective use of TypeScript** for type safety, particularly in defining types for API responses, component props, and application state.
   - **Why it's important:** Type safety reduces the risk of runtime errors and helps developers understand the expected structure of data throughout the application.

### 5. **Error Handling and UX Considerations**
   - **Pattern to focus on:** Look for proper error handling patterns, such as the use of error boundaries, graceful handling of API failures, and clear user feedback for invalid or missing data.
   - **Why it's important:** Robust error handling improves the user experience by making the app more resilient and providing users with clear guidance when things go wrong.

### 6. **Code Readability and Clean Code Principles**
   - **Pattern to focus on:** Clear, readable code with descriptive variable names, consistent formatting, and concise functions that focus on a single responsibility.
   - **Why it's important:** Clean code is easier to maintain and scale. It’s crucial that the code is self-explanatory and doesn’t require excessive comments to understand its purpose.

### 7. **Testing and Coverage**
   - **Pattern to focus on:** Look for well-written unit and integration tests that verify core functionality, especially for form data handling and edge case scenarios.
   - **Why it's important:** Testing is essential for ensuring the application behaves as expected and prevents regressions as new features are added.
