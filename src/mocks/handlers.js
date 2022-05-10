import { rest } from "msw";

const mockData = [
  {
    abilities: [
      {
        ability: {
          name: "overgrow",
          url: "https://pokeapi.co/api/v2/ability/65/",
        },
        is_hidden: false,
        slot: 1,
      },
      {
        ability: {
          name: "chlorophyll",
          url: "https://pokeapi.co/api/v2/ability/34/",
        },
        is_hidden: true,
        slot: 3,
      },
    ],
    height: 7,
    id: 1,
    name: "bulbasaur",
    weight: 69,
  },
  {
    abilities: [
      {
        ability: {
          name: "overgrow",
          url: "https://pokeapi.co/api/v2/ability/65/",
        },
        is_hidden: false,
        slot: 1,
      },
      {
        ability: {
          name: "chlorophyll",
          url: "https://pokeapi.co/api/v2/ability/34/",
        },
        is_hidden: true,
        slot: 3,
      },
    ],
    height: 3,
    id: 2,
    name: "venusaur",
    weight: 4,
  },
  {
    abilities: [
      {
        ability: {
          name: "overgrow",
          url: "https://pokeapi.co/api/v2/ability/65/",
        },
        is_hidden: false,
        slot: 1,
      },
      {
        ability: {
          name: "chlorophyll",
          url: "https://pokeapi.co/api/v2/ability/34/",
        },
        is_hidden: true,
        slot: 3,
      },
    ],
    height: 6,
    id: 3,
    name: "ivysaur",
    weight: 77,
  },
];

export const handlers = [
  rest.get("https://pokeapi.co/api/v2/pokemon", (req, res, ctx) => {
    return res(
      ctx.json({
        count: 1126,
        next: "https://pokeapi.co/api/v2/pokemon",
        previous: "https://pokeapi.co/api/v2/pokemon",
        results: [
          {
            name: "bulbasaur",
            url: "https://pokeapi.co/api/v2/pokemon/1/",
          },
          { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
          { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
        ],
      })
    );
  }),
  rest.get("https://pokeapi.co/api/v2/pokemon/*", (req, res, ctx) => {
    const index = req?.params?.[0][0] - 1 || 0;
    return res(ctx.json(mockData[index]));
  }),
];
