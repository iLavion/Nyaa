import type { AnyRouter } from "@tanstack/react-router";

import { isValidElement } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { render, type RenderResult } from "@testing-library/react";
import { type UserEvent, userEvent } from "@testing-library/user-event";

interface Options {
  withQueryClient?: boolean;
  withUser?: boolean;
}

const addWrappers = (
  Component: React.FC,
  { withQueryClient }: Omit<Options, "withUser">,
) => {
  if (withQueryClient) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return () => (
      <QueryClientProvider client={queryClient}>
        <Component />
      </QueryClientProvider>
    );
  }

  return Component;
};

const createTestRouter = (ProvidedComponent: React.FC) => {
  const rootRoute = createRootRoute({
    component: Outlet,
  });

  const componentRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: ProvidedComponent,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([componentRoute]),
    history: createMemoryHistory(),
  });

  return router;
};

type Component = React.FC | React.ReactElement;

function renderWithRouter(providedComponent: Component): RenderResult;

function renderWithRouter(
  providedComponent: Component,
  options: Partial<Options> & { withUser: true },
): { user: UserEvent } & RenderResult;

function renderWithRouter(
  providedComponent: Component,
  options: Partial<Options> & { withUser: false },
): RenderResult;

function renderWithRouter(
  providedComponent: Component,
  options: Partial<Options>,
): RenderResult;

function renderWithRouter(
  providedComponent: Component,
  { withUser, withQueryClient }: Options | undefined = {},
) {
  let Component: React.ComponentType = () => (
    <>The provided component could not be rendered</>
  );

  if (typeof providedComponent === "function") {
    Component = providedComponent;
  }

  if (isValidElement(providedComponent)) {
    Component = () => providedComponent;
  }

  Component = addWrappers(Component, { withQueryClient });

  const router = createTestRouter(Component);
  const renderResult = render(<RouterProvider router={router as AnyRouter} />);

  if (!withUser) return renderResult;

  return {
    user: userEvent.setup(),
    ...renderResult,
  };
}

export { renderWithRouter };
