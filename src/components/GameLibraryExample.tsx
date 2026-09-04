"use client";

import { useState } from "react";
import Image from "next/image";
import Icon from "@/components/Icon";

type Game = {
  id: string;
  name: string;
  genre: string;
  year: string;
  hours: string;
  image: string;
};

const games: Game[] = [
  {
    id: "counter-strike",
    name: "Counter Strike",
    genre: "FPS",
    year: "2004",
    hours: "2221,8",
    image: "/images/notes/datatable-vs-object-model/counter-strike.png",
  },
  {
    id: "knights-in-tight-spaces",
    name: "Knights in Tight Spaces",
    genre: "Tactics",
    year: "2023",
    hours: "27,8",
    image: "/images/notes/datatable-vs-object-model/knights-in-tight-spaces.png",
  },
  {
    id: "palworld",
    name: "Palworld",
    genre: "Survival",
    year: "2024",
    hours: "79,2",
    image: "/images/notes/datatable-vs-object-model/palworld.png",
  },
  {
    id: "hollow-knight",
    name: "Hollow Knight",
    genre: "Metroidvania",
    year: "2017",
    hours: "27,4",
    image: "/images/notes/datatable-vs-object-model/hollow-knight.png",
  },
  {
    id: "tunic",
    name: "TUNIC",
    genre: "Action-adventure",
    year: "2022",
    hours: "37,4",
    image: "/images/notes/datatable-vs-object-model/tunic.png",
  },
  {
    id: "thronefall",
    name: "Thronefall",
    genre: "Tower defense",
    year: "2023",
    hours: "27,5",
    image: "/images/notes/datatable-vs-object-model/thronefall.png",
  },
];

/** Illustrates the note's point with a small, real comparison: the same
 * data as a scannable table, then as recognizable objects. Hovering a row
 * or a card highlights its counterpart — nothing is clickable. */
export default function GameLibraryExample() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col items-start gap-16">
      <div className="full-bleed-lg flex w-full flex-col items-start gap-4">
        <p className="w-full font-display text-2xl font-normal text-text-primary">
          Table view
        </p>
        <table className="w-full border-collapse font-body">
          <thead>
            <tr className="border-b border-border-primary">
              <th className="w-full pb-2 pr-3 text-left text-sm font-normal text-text-secondary">
                Name
              </th>
              <th className="whitespace-nowrap pb-2 pr-3 text-left text-sm font-normal text-text-secondary">
                Genre
              </th>
              <th className="whitespace-nowrap pb-2 pr-3 text-left text-sm font-normal text-text-secondary">
                Year
              </th>
              <th className="whitespace-nowrap pb-2 text-left text-sm font-normal text-text-secondary">
                Hours
              </th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr
                key={game.id}
                onMouseEnter={() => setHoveredId(game.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`transition-colors ${
                  hoveredId === game.id ? "bg-bg-tertiary" : ""
                }`}
              >
                <td className="w-full rounded-l-lg py-2 pl-2 pr-3 text-lg text-text-primary">
                  {game.name}
                </td>
                <td className="whitespace-nowrap py-2 pr-3 text-lg text-text-primary">
                  {game.genre}
                </td>
                <td className="whitespace-nowrap py-2 pr-3 text-lg text-text-primary">
                  {game.year}
                </td>
                <td className="whitespace-nowrap rounded-r-lg py-2 pr-2 text-lg text-text-primary">
                  {game.hours}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="full-bleed-lg flex w-full flex-col items-start gap-4">
        <p className="w-full font-display text-2xl font-normal text-text-primary">
          Object view
        </p>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {games.map((game) => (
            <div
              key={game.id}
              onMouseEnter={() => setHoveredId(game.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`flex flex-col items-start gap-1 overflow-hidden rounded-lg bg-bg-secondary p-1.5 transition-colors ${
                hoveredId === game.id ? "bg-bg-tertiary" : ""
              }`}
            >
              <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-md">
                <Image
                  src={game.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="flex w-full flex-col items-start gap-2 p-2">
                <div className="flex w-full items-center gap-1.5">
                  <p className="min-w-0 flex-1 truncate font-body text-base font-semibold text-text-accent">
                    {game.name}
                  </p>
                  <span className="shrink-0 rounded-full bg-bg-tertiary px-2.5 py-0.5 font-body text-xs text-text-secondary">
                    {game.genre}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon
                    name="schedule"
                    variant="outlined"
                    aria-hidden
                    size={16}
                    className="text-text-secondary"
                  />
                  <p className="font-body text-sm">
                    <span className="text-text-primary">{game.hours}</span>{" "}
                    <span className="text-text-secondary">hours played</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
