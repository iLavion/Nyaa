/* eslint-disable react-refresh/only-export-components --
 * Let's disable the rule for the whole file since it's not a React component,
 * but we still want to perform linting on it.
 **/
// extends Vitest's expect method with methods from react-testing-library
import "@testing-library/jest-dom/vitest";

import type { RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach } from "vitest";

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

const Providers = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

// setup function
export const setup = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => {
  return {
    user: userEvent.setup(),
    // Import `render` from the framework library of your choice.
    // See https://testing-library.com/docs/dom-testing-library/install#wrappers
    ...render(ui, { wrapper: Providers, ...options }),
  };
};

// re-export everything; developers should import from setup.tsx
export * from "@testing-library/react";
