import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderWithRouter } from ".";

afterEach(() => {
  vi.restoreAllMocks();
});

const TestComponent = () => {
  const _router = useRouter({ warn: true });

  return <div>TestComponent</div>;
};

describe("renderWithRouter", () => {
  it("should render with router", async () => {
    const spy = vi.spyOn(console, "warn");

    const { unmount } = render(<TestComponent />);

    expect(spy).toHaveBeenCalledWith(
      "Warning: useRouter must be used inside a <RouterProvider> component!",
    );

    unmount();
    spy.mockReset();

    renderWithRouter(TestComponent);

    expect(screen.getByText(/TestComponent/i)).toBeVisible();
    expect(spy).not.toHaveBeenCalled();
  });

  describe("withQueryClient", () => {
    const TestQueryComponent = () => {
      const _query = useQuery({ queryKey: ["test"] });

      return <div>TestComponent</div>;
    };

    it("should render with query client", async () => {
      expect(() => render(<TestQueryComponent />)).toThrow();

      expect(() =>
        renderWithRouter(<TestQueryComponent />, { withQueryClient: true }),
      ).not.toThrow();
    });
  });

  describe("withUser", () => {
    it("should not return an user if withUser is false", async () => {
      vi.spyOn(userEvent, "setup");

      const output = renderWithRouter(TestComponent, { withUser: false });

      expect(output).not.toHaveProperty("user");
      expect(userEvent.setup).not.toHaveBeenCalled();
    });

    it("should return an user if withUser is true", async () => {
      vi.spyOn(userEvent, "setup");

      const output = renderWithRouter(TestComponent, { withUser: true });

      expect(output).toHaveProperty("user");
      expect(userEvent.setup).toHaveBeenCalledOnce();
    });
  });
});
