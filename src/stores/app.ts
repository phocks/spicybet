import { atom } from "nanostores";

export const app = atom(null);

export const setApp = (value) => app.set(value);
