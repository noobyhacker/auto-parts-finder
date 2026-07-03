import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./App.tsx";
import "./index.css";

// SSG entry: pre-renders every route to HTML at build, then hydrates in the browser.
export const createRoot = ViteReactSSG({ routes });
