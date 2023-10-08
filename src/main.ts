// Global styles
import "./app.css";

// Import our main App component
import App from "./App.svelte";

// Select the #app element and set to target
const target = document.getElementById("app");
if (!target) throw new Error("Could not find #app element in index.html");

// Create a new instance of our App component
const app = new App({ target });

// Main module export
export default app;
