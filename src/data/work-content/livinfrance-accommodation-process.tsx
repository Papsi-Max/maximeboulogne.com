export type WorkContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "image"; src: string; alt: string; width: number; height: number }
  | {
      type: "screenPair";
      desktop: { src: string; alt: string; width: number; height: number };
      mobile: { src: string; alt: string; width: number; height: number };
      caption?: string;
    }
  | { type: "heading"; text: string; note?: string }
  | {
      type: "accordionImage";
      title: string;
      note?: string;
      src: string;
      alt: string;
      width: number;
      height: number;
    }
  | {
      type: "callout";
      icon: string;
      title: string;
      items: string[];
    };

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
      src: "/images/work/logement-etudiant/01-listing-desktop.png",
      alt: "Listings page with interactive map, desktop",
      width: 2880,
      height: 2048,
    },
    mobile: {
      src: "/images/work/logement-etudiant/02-listing-mobile.png",
      alt: "Listings page, mobile version",
      width: 766,
      height: 1350,
    },
    caption: "Listings",
  },
  {
    type: "screenPair",
    desktop: {
      src: "/images/work/logement-etudiant/03-detail-desktop.png",
      alt: "Listing detail with commute map, desktop",
      width: 2880,
      height: 2048,
    },
    mobile: {
      src: "/images/work/logement-etudiant/04-detail-mobile.png",
      alt: "Listing detail, mobile version",
      width: 766,
      height: 1350,
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
      src: "/images/work/logement-etudiant/05-payment-schedule-desktop.png",
      alt: "Upcoming payment schedule detail, desktop",
      width: 2880,
      height: 2048,
    },
    mobile: {
      src: "/images/work/logement-etudiant/06-payment-detail-mobile.png",
      alt: "Payments detail, mobile version",
      width: 766,
      height: 1350,
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
      src: "/images/work/logement-etudiant/07-information-form-desktop.png",
      alt: "Simplified personal information form, desktop",
      width: 2880,
      height: 2048,
    },
    mobile: {
      src: "/images/work/logement-etudiant/08-information-form-mobile.png",
      alt: "Information form, mobile version",
      width: 766,
      height: 1350,
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
      src: "/images/work/logement-etudiant/09-payment-desktop.png",
      alt: "Final payment step, desktop",
      width: 2880,
      height: 2048,
    },
    mobile: {
      src: "/images/work/logement-etudiant/10-payment-mobile.png",
      alt: "Payment step, mobile version",
      width: 766,
      height: 1350,
    },
    caption: "Final payment",
  },
  {
    type: "accordionImage",
    title: "See the full product journey",
    note: "This funnel is part of a broader flow — expand to see the entire booking journey as it worked at the end of the project",
    src: "/images/work/logement-etudiant/11-full-journey.png",
    alt: "Full booking journey diagram, from landing to confirmation",
    width: 2138,
    height: 2871,
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
