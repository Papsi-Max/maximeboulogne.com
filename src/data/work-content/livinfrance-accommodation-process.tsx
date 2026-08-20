import type { WorkContentBlock } from "./types";

export type { WorkContentBlock };

export const livinfranceAccommodationProcessContent: WorkContentBlock[] = [
  {
    type: "paragraph",
    text: "As the sole product designer at LivinFrance, I identified that our housing booking journey was losing most users before conversion — a direct hit to our ability to generate recurring revenue.",
  },
  {
    type: "paragraph",
    text: "I started by pulling data from the existing funnel (the only data available at the time), which revealed a clear trust problem among our users:",
  },
  {
    type: "quote",
    text: "Listings → Listing detail → Payment breakdown → Booking form",
  },
  {
    type: "screenPair",
    desktop: {
      src: "/images/work/logement-etudiant/01-listing-desktop.webp",
      alt: "Listings page with interactive map, desktop",
      width: 1600,
      height: 1138,
      blurDataURL:
        "data:image/webp;base64,UklGRmQAAABXRUJQVlA4WAoAAAAQAAAACQAABgAAQUxQSBcAAAABF9D/iAgoaBsFuhfwbxoLEf1PIviEAwBWUDggJgAAALABAJ0BKgoABwAFQHwlpAAC510++AAA/uuFY+nFiBwZYnltoaAA",
    },
    mobile: {
      src: "/images/work/logement-etudiant/02-listing-mobile.webp",
      alt: "Listings page, mobile version",
      width: 766,
      height: 1350,
      blurDataURL:
        "data:image/webp;base64,UklGRq4AAABXRUJQVlA4WAoAAAAQAAAACQAAEQAAQUxQSC4AAAABN0CkbePf4m0cDdVGRATWA6LIVrKg3olAFKPYvwZHC0T0P1fqawLla6LMSf0AVlA4IFoAAACwAwCdASoKABIAPzmGulOvKKWisAgB4CcJYwAASTsTYM+Z2AGogAD+yDOBDb182HwYC1XJNsG+6wnBpgN9eWFQV1vSQ2c9HRGIi5k6IvXYSP8D84zWrPnUkAA=",
    },
    caption: "Listings",
  },
  {
    type: "screenPair",
    desktop: {
      src: "/images/work/logement-etudiant/03-detail-desktop.webp",
      alt: "Listing detail with commute map, desktop",
      width: 1600,
      height: 1138,
      blurDataURL:
        "data:image/webp;base64,UklGRmIAAABXRUJQVlA4WAoAAAAQAAAACQAABgAAQUxQSBcAAAABF9D/iAgoaBsFuhfwbxoLEf1PIviEAwBWUDggJAAAALABAJ0BKgoABwAFQHwlpAADF/90tAAA/u3Xu2QMg4wWEAAAAA==",
    },
    mobile: {
      src: "/images/work/logement-etudiant/04-detail-mobile.webp",
      alt: "Listing detail, mobile version",
      width: 766,
      height: 1350,
      blurDataURL:
        "data:image/webp;base64,UklGRqoAAABXRUJQVlA4WAoAAAAQAAAACQAAEQAAQUxQSC4AAAABN0CkbePf4m0cDdVGRATWA6LIVrKg3olAFKPYvwZHC0T0P1fqawLla6LMSf0AVlA4IFYAAABwAwCdASoKABIAPzmEuVOvKKWisAgB4CcJYgAASQRfkHNhMgAA908sa8XkhrLs71ZbIaYfLNvckG58l+M2zSRjVASAgwfVEgGEryFoRWJK7kX/LgIAAA==",
    },
    caption: "Listing detail",
  },
  {
    type: "paragraph",
    text: "50% of users dropped off between the payment schedule explanation and the completed personal information form, and a further 90% after the payment step itself.",
  },
  {
    type: "paragraph",
    text: "To understand precisely what was blocking users, I had the customer support team interview users and surface the friction points in the journey.",
  },
  {
    type: "paragraph",
    text: "Users hesitated on the page detailing the full payment schedule, overwhelmed by the number of installments. I chose to keep that transparency rather than remove it. Hiding it would have reduced short-term drop-off, but would have recreated the trust problem later in the journey, at the point of future payments. So I restructured the display to show only the steps remaining before booking, rather than the entire payment calendar at once.",
  },
  {
    type: "screenPair",
    desktop: {
      src: "/images/work/logement-etudiant/05-payment-schedule-desktop.webp",
      alt: "Upcoming payment schedule detail, desktop",
      width: 1600,
      height: 1138,
      blurDataURL:
        "data:image/webp;base64,UklGRmoAAABXRUJQVlA4WAoAAAAQAAAACQAABgAAQUxQSBcAAAABF9D/iAgoaBsFuhfwbxoLEf1PIviEAwBWUDggLAAAANABAJ0BKgoABwAFQHwllAAC6yjfT1EIAP7v0hhnM1UQXVQv1FA/yKqhAAAA",
    },
    mobile: {
      src: "/images/work/logement-etudiant/06-payment-detail-mobile.webp",
      alt: "Payments detail, mobile version",
      width: 766,
      height: 1350,
      blurDataURL:
        "data:image/webp;base64,UklGRpgAAABXRUJQVlA4WAoAAAAQAAAACQAAEQAAQUxQSC4AAAABN0CkbePf4m0cDdVGRATWA6LIVrKg3olAFKPYvwZHC0T0P1fqawLla6LMSf0AVlA4IEQAAADQAwCdASoKABIAPzmKu1SvKaYjMAgB4CcJYgAAXKdKE3OKMqEHSbAA/sNlfqBgpU+VRz2HOMIp0MLpoRP5+VNPND4AAA==",
    },
    caption: "Payment schedule, restructured to show only the remaining steps",
  },
  {
    type: "paragraph",
    text: "The second, bigger problem was the personal information form: most users couldn't get through it. Digging deeper, it turned out most of these fields weren't actually needed at this stage of the journey, and their sheer number discouraged users to the point that some left the funnel to book with a competitor.",
  },
  {
    type: "paragraph",
    text: 'I cut the form from 8 fields to 3, keeping only what was genuinely essential at this stage, replaced the calendar picker with three dropdown menus, and removed the "City," "Postal code," "Region," and "Country" fields — too specific to the French address format — in favor of a single address field powered by Google autocomplete, usable regardless of address format.',
  },
  {
    type: "screenPair",
    desktop: {
      src: "/images/work/logement-etudiant/07-information-form-desktop.webp",
      alt: "Simplified personal information form, desktop",
      width: 1600,
      height: 1138,
      blurDataURL:
        "data:image/webp;base64,UklGRmgAAABXRUJQVlA4WAoAAAAQAAAACQAABgAAQUxQSBcAAAABF9D/iAgoaBsFuhfwbxoLEf1PIviEAwBWUDggKgAAANABAJ0BKgoABwAFQHwllAAC6yjfLIwAAP7v0hhnM1UQXVQvad35FVQgAA==",
    },
    mobile: {
      src: "/images/work/logement-etudiant/08-information-form-mobile.webp",
      alt: "Information form, mobile version",
      width: 766,
      height: 1350,
      blurDataURL:
        "data:image/webp;base64,UklGRqAAAABXRUJQVlA4WAoAAAAQAAAACQAAEQAAQUxQSC4AAAABN0CkbePf4m0cDdVGRATWA6LIVrKg3olAFKPYvwZHC0T0P1fqawLla6LMSf0AVlA4IEwAAACwAwCdASoKABIAPzmIu1QvKSYjMAgB4CcJaAAASqnbIkl3yHACAAD+xGHFl4ypThjVTdL5JzQsKQkhcAALcpT3NJXQ64zNJiv7EkAA",
    },
    caption: "Form reduced from 8 to 3 fields",
  },
  {
    type: "paragraph",
    text: "The remaining adjustments addressed information users systematically asked our support team about, so the journey no longer needed to be explained.",
  },
  {
    type: "paragraph",
    text: "Result: Users progressed significantly further through the funnel, all the way to actual booking, where the majority previously dropped off before even completing their information.",
  },
  {
    type: "quote",
    text: "Listings → Listing detail → Payment schedule explanation → Information request to build the file → Payment",
  },
  {
    type: "screenPair",
    desktop: {
      src: "/images/work/logement-etudiant/09-payment-desktop.webp",
      alt: "Final payment step, desktop",
      width: 1600,
      height: 1138,
      blurDataURL:
        "data:image/webp;base64,UklGRmoAAABXRUJQVlA4WAoAAAAQAAAACQAABgAAQUxQSBcAAAABF9D/iAgoaBsFuhfwbxoLEf1PIviEAwBWUDggLAAAALABAJ0BKgoABwAFQHwllAAC6ygcywAA/u/SGGczVRBE+dcLCf2LtsQRCAAA",
    },
    mobile: {
      src: "/images/work/logement-etudiant/10-payment-mobile.webp",
      alt: "Payment step, mobile version",
      width: 766,
      height: 1350,
      blurDataURL:
        "data:image/webp;base64,UklGRqoAAABXRUJQVlA4WAoAAAAQAAAACQAAEQAAQUxQSC4AAAABN0CkbePf4m0cDdVGRATWA6LIVrKg3olAFKPYvwZHC0T0P1fqawLla6LMSf0AVlA4IFYAAACwAwCdASoKABIAPzmEuVOvKKWisAgB4CcJYwAAVF9SgAT5Qbfo0AD+0+TR2WkcYSOlDHT52z+x2puXGN62PW6KP7Iz2Q+2h1PWJuKX/xIFCQcWUIAAAA==",
    },
    caption: "Final payment",
  },
  {
    type: "accordionImage",
    title: "See the full product journey",
    note: "This funnel is part of a broader flow — expand to see the entire booking journey as it worked at the end of the project",
    src: "/images/work/logement-etudiant/11-full-journey.webp",
    alt: "Full booking journey diagram, from landing to confirmation",
    width: 1400,
    height: 1880,
    blurDataURL:
      "data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAAQAAAACQAADAAAQUxQSBEAAAABD9D/iAgIBAj8h0uI6H8aGwBWUDggGgAAADABAJ0BKgoADQAFQHwlpAADcAD+8H/At0AA",
  },
  {
    type: "callout",
    icon: "🔮",
    title: "What I'd do differently today",
    items: [
      "Contrast of floating elements: buttons overlaid on photos (back, share, favorites) used a light background with white icons — insufficient for accessibility (AA ratio) and illegible on very bright photos. Today, I'd systematically use a dark, semi-opaque scrim behind these elements regardless of the background content.",
      "Touch targets: several clickable zones (secondary navigation, photo actions) were under the recommended 44×44px. Something I now build into my specs by default.",
    ],
  },
];
