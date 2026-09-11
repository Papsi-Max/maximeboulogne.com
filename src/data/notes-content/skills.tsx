import type { NoteContentBlock } from "./types";

export const skillsContent: NoteContentBlock[] = [
  {
    type: "paragraph",
    text: "Claude, or any LLM, can be used every day for product design work. Not only as a chatbot you ask questions to, but as something closer to a copilot who shares the same references you do. Those references slowly turned into skills: one on the Laws of UX, one on debunked UX myths.",
  },
  {
    type: "paragraph",
    text: "A skill is a folder Claude reads before it answers. Not a prompt retyped each time, a standing reference it consults on its own when the conversation matches. The ux-laws skill grounds a critique in Fitts, Hick, Jakob, Gestalt, the usual names, instead of \"this feels off.\" The uxmyths skill catches the reverse: a design decision resting on something that sounds true and isn't. \"More choices make users happier.\" It doesn't.",
  },
  {
    type: "commandBlock",
    linkText: "github.com/Papsi-Max/skills",
    href: "https://github.com/Papsi-Max/skills",
    command: "npx skills@latest add Papsi-Max/skills",
  },
  {
    type: "paragraph",
    text: "Writing them down forced a distinction I hadn't made explicit before: knowing a framework and having it ready at the right moment are different skills. I know Hick's Law. I don't always reach for it during design review, or when a dropdown has grown to forty items. Having the skill ready makes it easier to stay pragmatic, and to argue from references instead of feel.",
  },
  {
    type: "paragraph",
    text: "Publishing them wasn't the point of writing them. But once they existed, keeping them private felt like the wrong default. Same instinct as open-sourcing code: the underlying research isn't mine, only the synthesis is, so the synthesis can be shared too.",
  },
];
