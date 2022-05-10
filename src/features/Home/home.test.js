import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { rest } from "msw";
import { server } from "../../mocks/server";

import Home from ".";

test("it should render home", async () => {
  render(
    <Router>
      <Home />
    </Router>
  );

  const PokeImages = await screen.findAllByRole("img");
  expect(PokeImages).toHaveLength(3);
});

test("it should sort the results", async () => {
  render(
    <Router>
      <Home />
    </Router>
  );

  const sortBy = await screen.findAllByLabelText(/sort by :/i);
  fireEvent.change(sortBy[0], { target: { value: "height" } });
});

test("it should navigate to next/ prev page", async () => {
  render(
    <Router>
      <Home />
    </Router>
  );

  const PokeImages = await screen.findAllByRole("img");
  const forwardNav = await screen.findAllByText(/next/i);
  const backwardNav = await screen.findAllByText(/prev/i);

  expect(PokeImages).toHaveLength(3);
  expect(forwardNav[0]).toBeInTheDocument();
  expect(backwardNav[0]).toBeInTheDocument();
  fireEvent.click(forwardNav[0]);
  fireEvent.click(backwardNav[0]);
});

test("it should change number of results displayed", async () => {
  render(
    <Router>
      <Home />
    </Router>
  );
  const limit = await screen.findAllByLabelText(/show :/i);
  fireEvent.change(limit[0], { target: { value: "10" } });
});

test("it should search for pokemon", async () => {
  render(
    <Router>
      <Home />
    </Router>
  );
  const searchInput = await screen.findAllByPlaceholderText(
    "Search for pokemon"
  );
  const searchButton = await screen.findAllByText("Search");
  searchInput[0].value = "bulbasaur";

  fireEvent.click(searchButton[0]);
});

test("it should handle errors gracefully", async () => {
  server.resetHandlers(
    rest.get("https://pokeapi.co/api/v2/pokemon", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(
    <Router>
      <Home />
    </Router>
  );

  const error = await screen.findByRole("alert");
  expect(error).toBeInTheDocument();
});
