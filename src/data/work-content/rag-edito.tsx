import type { WorkContentBlock } from "./types";

export const ragEditoContent: WorkContentBlock[] = [
  {
    type: "paragraph",
    text: "TL;DR: The AI Program had identified that nearly 5% of queries typed into LeroyMerlin.fr's search bar were natural-language DIY questions. I joined this project to design the RAG Edito, an experience that turns these queries into actionable answers paired with the right products. This work became the learning ground from which I co-wrote the group's AI UX guidelines, then coached other designers on applying them, with measurable results at platform scale.",
  },
  { type: "sectionHeading", text: "Context" },
  {
    type: "paragraph",
    text: "Before I even joined the project, the AI Program had spotted an opportunity: nearly 5% of queries typed into LeroyMerlin.fr's search bar were phrased as DIY questions rather than product keywords. That's how the RAG Edito was born: a system able to answer questions by drawing on the site's editorial articles, while recommending the products needed to carry out DIY projects.",
  }, 
  {
    type: "row",
    columns: [
      {
        cols: 2,
        blocks: []
      },
      {
        cols: 4,
        blocks: [
          {
            type: "paragraph",
            text: "I designed the product's editorial experience: structuring each answer into actionable steps, pairing each step with the relevant products, and sourcing every piece of content back to its original article to preserve user trust rather than generating an opaque answer.",
          },
          {
            type: "paragraph",
            text: "This work happened in near-constant collaboration with the data engineer, who built the knowledge graph and drove the model (based on Gemini) behind the product. That closeness went beyond simply specifying an interface — we worked together on:",
          },
          {
            type: "list",
            items: [
              "the knowledge graph's relevance criteria,",
              "fallback cases when no reliable answer was available,",
              "and explored different approaches to user-facing interface generation.",
            ],
          },
          {
            type: "paragraph",
            text: "Interface generation structures the answer into a personality-driven piece of content that adapts to the question rather than following a fixed template. It's a direction I keep exploring, drawing on Dan Saffer's work on interaction design and on watch-projects like UI for AI, which explore AI interfaces beyond the prompt.",
          },
        ],
      },
      {
        cols: 4,
        blocks: [
          {
            type: "image",
            src: "/images/work/rag-edito/01-search-results-page.webp",
            alt: "Leroy Merlin search results page for a natural-language DIY question, with editorial steps and matched products",
            width: 1280,
            height: 3435,
            blurDataURL:
              "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoKABsAPzmGu1QvKSYjMAgB4CcJZwAAW+oVZey6dJIjCAAA/t6HIMVyNM7eDg3VYzsgggT7IfDlCk3hkJmmhEYFHoHjo8BAAAA=",
          },
        ],
      },
    ],
  },
  {
    type: "stat",
    icon: "📊",
    text: "117,700 queries processed by the RAG · 31,100 pieces of content displayed · 72.2s average time on page · CTR improving continuously since launch (starting value not retained)",
  },
  {
    type: "sectionHeading",
    text: "Confronting the design with real usage",
  },
  {
    type: "paragraph",
    text: "Designing for generative content also challenged the way we design and test.",
  },
  {
    type: "list",
    items: [
      "Working with AI engineering from ideation onward — The classic \"design then development\" sequence no longer holds when the technology moves this fast. The collaboration with the data engineers surfaced that first, and it became a formalized principle for the rest of the platform.",
      "Testing in a real environment rather than on a mockup — A SUS score obtained on a static mockup carries little value for a generative experience, which is by nature dynamic and unpredictable.",
    ],
  },
  {
    type: "paragraph",
    text: "In July 2025, I ran the full set of sessions and led the analysis of a user-testing campaign on the site's generative features: 7 participants, 45-minute semi-structured sessions, with an open-observation brief to capture spontaneous behavior and moments of doubt in front of generated answers.",
  },
  {
    type: "paragraph",
    text: "Over one year, French users' familiarity with generative AI had gone from 33% to 88% awareness, with 74% active usage among 18-24 year-olds versus only 17% among the over-60s. Expectations were shifting faster than our interfaces. Users arrive with a ChatGPT- or Perplexity-shaped reflex: they type a full question in natural language rather than keywords, then systematically click through the cited references to verify the answer and weigh it against their own experience.",
  },
  {
    type: "quote",
    text: "“Even my mother figured out she had to ask full questions. And now she uses the voice feature to ask hers.”",
    attribution: "User from the 7th test",
  },
  {
    type: "paragraph",
    text: "This study directly validated the choice to systematically source every answer back to its original article: a behavior we measured against a verification habit observed in almost all participants. The findings were then written up by Paul Thanasack, Head of UX AI & New Technologies, who drew the strategic conclusion for the platform.",
  },
  {
    type: "paragraph",
    text: "In December 2025, a second user test tracked how customers' understanding of AI had evolved, producing an average System Usability Scale score of 85 — showing that usability moves in step with the AI's own capabilities.",
  },
  {
    type: "sectionHeading",
    text: "Turning it into standards",
  },
  {
    type: "paragraph",
    text: "This work confronted me with the same questions, over and over: how do you present a generated answer while staying transparent? How do you handle model uncertainty without breaking trust? How do you avoid turning every interaction into a conversation when a simple suggestion would do?",
  },
  {
    type: "row",
    columns: [
      {
        cols: 2,
        blocks: []
      },
      {
        cols: 5,
        blocks: [
          {
            type: "paragraph",
            text: "Rather than keep these answers for this one product, I formalized them with the Head of Design into AI UX guidelines for the whole group, structured around four principles:",
          },
          {
            type: "list",
            items: [
              "AI centered on real needs rather than technology demonstration,",
              "AI that is ethical and transparent about how it works,",
              "AI aligned with existing behaviors rather than imposing new patterns,",
              "and AI that is available without being intrusive.",
            ],
          },
        ],
      },
      {
        cols: 3,
        blocks: [
          {
            type: "image",
            src: "/images/work/rag-edito/02-ai-guidelines-cover.webp",
            alt: "Cover of the ADEO group's Design & Artificial Intelligence guidelines",
            width: 637,
            height: 637,
            blurDataURL:
              "data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAACwAQCdASoKAAoABUB8JQBOgBuEbxgAAP7sJU+KtTWxaf6l5biMycw3QhaA65MpBSGUAMmH0AA=",
          },
        ],
      },
    ],
  },
  {
    type: "paragraph",
    text: "All of it in the spirit of Josh Clark's Sentient Design: proactive when context justifies it, on-demand the rest of the time. The signal that indicates an AI is at work (or its absence) is something Luke Wroblewski has written extensively about, particularly on standardizing AI icons — a line of thinking that directly fed the \"ethical and transparent\" pillar.",
  },
  {
    type: "row",
    columns: [
      {
      cols: 3,
      blocks: []
      },
      {
        cols: 6,
        blocks: [
          {
          type: "image",
          src: "/images/work/rag-edito/03-virtual-assistant-widget.webp",
          alt: "Virtual assistant widget with a question field and suggested follow-up questions",
          width: 1128,
          height: 562,
          blurDataURL:
            "data:image/webp;base64,UklGRmQAAABXRUJQVlA4WAoAAAAQAAAACQAABAAAQUxQSBsAAAABJ3D//4iIAYNsIwd79wKP8ggf0f8oDgQLBg8AVlA4ICIAAAAwAQCdASoKAAUABUB8JZwAA3AA/u8YCVZWQkDtvzEuQEAA",
          }
        ]
      },
    ]
  },
  {
    type: "sectionHeading",
    text: "Supporting their rollout",
  },
  {
    type: "paragraph",
    text: "Guidelines alone aren't enough. I coached several designers through applying them in practice: recurring design reviews, coaching on real cases, notably the Search Widget on product pages and the site's Virtual Assistant.",
  },
  {
    type: "paragraph",
    text: "The RAG Edito has since been handed over to the search team's dedicated designer. To me, that's the sign a product has reached maturity: it no longer needs me to keep evolving. I stayed on as cross-team reference for the group's AI UX standards.",
  },
  {
    type: "stat",
    icon: "📈",
    text: "On the Search Widget, usage rate went from 0.16% to 2.45% after applying the guidelines (+1431%), with an estimated business impact of €21.8M in annual GMV on the France web platform.",
  },
  {
    type: "row",
    columns: [
      {
        cols: 12,
        blocks: [
          {
            type: "image",
            src: "/images/work/rag-edito/04-virtual-assistant-product-page.webp",
            alt: "Virtual assistant integrated into a Leroy Merlin product page, answering a question about a product",
            width: 1063,
            height: 760,
            blurDataURL:
              "data:image/webp;base64,UklGRi4AAABXRUJQVlA4ICIAAAAwAQCdASoKAAcABUB8JaQAA3AA/vBm8xfPTWUnIRdIAAAA",
          }
        ]
      },
    ]
  },
  {
    type: "sectionHeading",
    text: "My role",
  },
  {
    type: "list",
    items: [
      "Designed the RAG Edito's experience (answer structure, sourcing, product pairing)",
      "Ongoing collaboration with AI engineering on relevance, fallbacks, and interface generation",
      "Ran and analyzed user testing on generative features",
      "Co-wrote the group's AI UX guidelines",
      "Coaching and design reviews for designers applying these standards",
    ],
  },
];
