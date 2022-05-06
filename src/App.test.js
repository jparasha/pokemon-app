import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders sort by text", () => {
  render(<App />);
  const linkElement = screen.getByLabelText(/sort by :/i);
  expect(linkElement).toBeInTheDocument();
});
