import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { rest } from "msw";
import { server } from "../../mocks/server";

import Details from ".";

test("it should render details", async () => {
  render(
    <Router>
      <Details />
    </Router>
  );

  const PokeImage = await screen.findAllByRole("img");
  expect(PokeImage).toHaveLength(1);
});

test("it should handle details errors gracefully", async () => {
  server.resetHandlers(
    rest.get("https://pokeapi.co/api/v2/pokemon/*", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  render(
    <Router>
      <Details />
    </Router>
  );
  const error = await screen.findAllByRole("alert");
  const errorText = await screen.findByText(/No Match Found/i);
  expect(error).toHaveLength(1);
  expect(errorText).toBeInTheDocument();
});
