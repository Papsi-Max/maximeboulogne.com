import type { NoteContentBlock } from "./types";

const base = "/images/notes/a-gamification-workshop-on-a-real-business-case";

export const aGamificationWorkshopOnARealBusinessCaseContent: NoteContentBlock[] =
  [
    {
      type: "paragraph",
      text: "The first workshop ended on a promise. Take one real business case and build around it. This time the case was a back-office role. Its job is to get items ready to be sold. The work is spread across several tools, and the only overview is a personal spreadsheet. The real goal is a sellable item, not a ticked box. The tools only show boxes.",
      link: {
        text: "The first workshop",
        href: "/notes/a-workshop-on-video-game-mechanics",
      },
    },
    {
      type: "image",
      src: `${base}/octalysis-audit.png`,
      alt: "Octalysis octagon for the case: scarcity, unpredictability and avoidance are marked strong, while accomplishment, empowerment, ownership, social influence and epic meaning are marked weak.",
      width: 1116,
      height: 895,
      blurDataURL:
        "data:image/webp;base64,UklGRpIAAABXRUJQVlA4WAoAAAAQAAAACQAABwAAQUxQSDAAAAABN0AmbePfbtm92IiIwBsoZCMJGoRFWIRFOIRDOH+PRyGi/wSTNNV2DOA56H0qHgNWUDggPAAAABACAJ0BKgoACAAFQHwljALDtipe4qSW2gAA/sUZQX8V8ZkOPN/Ojm6ekq4x+kozAcdJ+FEGnVxUmlwAAA==",
      caption: "The case read with Octalysis",
    },
    {
      type: "paragraph",
      text: "We read the case with Octalysis first. It was strong on pressure nobody had designed: waiting on others, deadlines, the fear of being late. It was weak on almost everything that feels good. Nobody can see how far an item has come. The group voted for Accomplishment first, then Empowerment.",
    },
    {
      type: "image",
      src: `${base}/mechanics-board.png`,
      alt: "Workshop board with two columns, Empowerment and Accomplishment, filled with sticky notes and game screenshots such as the Cyberpunk 2077 skill tree, the Super Mario World map and the Pokédex.",
      width: 1007,
      height: 992,
      blurDataURL:
        "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAACQAQCdASoKAAoABUB8JQAASj4V7gAA/tYXvBRsk1pUxCuOpb+Vbo4UTmg6WZyTA3zi61QRaULe+6cEbqiQMUAA",
      caption: "Mechanics collected by the group for each drive",
    },
    {
      type: "paragraph",
      text: "Then everyone looked for mechanics that make progress visible. They came back with the skill tree in Cyberpunk 2077, the world map of Super Mario World that reveals itself step by step, the Pokédex, a build in Minecraft that stays in place. Three constraints framed the work. The tool stays a helper, not a monitor. The end goal stays the sellable item. Some data arrives late and from outside.",
    },
    {
      type: "imageRow",
      images: [
        {
          src: `${base}/prototype-item.png`,
          alt: "Prototype home screen: a sword in a central circle, surrounded by four areas with their progress. Materials 1 of 5 steps, Reputation 4 of 6, Plans 0 of 4, Enchants 2 of 3.",
          width: 1080,
          height: 1160,
          blurDataURL:
            "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBoAAAAwAQCdASoKAAsABUB8JaQAA3AA/u8t0kwAAA==",
          caption: "The item at the centre, four areas around it",
        },
        {
          src: `${base}/prototype-area.png`,
          alt: "The Materials area opened as a tree. Ore selection is done and Smelt the ingot is next. Alloy ratio, Gem grade and Guild assay are locked, and the last node promises 15 percent more durability.",
          width: 1228,
          height: 1254,
          blurDataURL:
            "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoKAAoABUB8JaQAA3AA/u8kQAA=",
          caption: "One area opened: a tree of steps that unlock in order",
        },
      ],
    },
    {
      type: "paragraph",
      text: "The prototype puts the item at the centre. Four areas surround it, each with its own progress. Opening an area shows a small tree of steps. A step unlocks when the previous one is done. The last node is a validation. The person no longer reads a list of tasks.",
    },
  ];
