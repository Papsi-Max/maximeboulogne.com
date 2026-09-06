"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Icon from "@/components/Icon";
import Tag from "@/components/Tag";

type Mechanic = {
  id: string;
  name: string;
  game: string;
  needs: string[];
  image: string;
  imageBlurDataURL: string;
};

const mechanics: Mechanic[] = [
  {
    id: "turn-based-battle",
    name: "Turn-based battle",
    game: "Dofus",
    needs: [
      "Unpredictability & Curiosity",
      "Social Influence & Relatedness",
      "Empowerment of Creativity & Feedback",
    ],
    image: "/images/notes/a-workshop-on-video-game-mechanics/turn-based-battle.png",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRoIAAABXRUJQVlA4WAoAAAAQAAAACQAABQAAQUxQSCgAAAABP0CQbeOPeoivGhER1BwUtW0DRWUwJiPTIRn/z4Uhov8pIHlimLLdVlA4IDQAAACwAQCdASoKAAYABUB8JbACdADZkQoAAMsIUREaoQ0ShvQnNK0Mg+HjZ+OVL7PL+OZ18VwA",
  },
  {
    id: "skillbar",
    name: "Skillbar",
    game: "World of Warcraft",
    needs: ["Development & Accomplishment", "Ownership & Possession"],
    image: "/images/notes/a-workshop-on-video-game-mechanics/skillbar.png",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRnoAAABXRUJQVlA4WAoAAAAQAAAACQAABQAAQUxQSCgAAAABP0CQbeOPeoivGhER1BwUtW0DRWUwJiPTIRn/z4Uhov8pIHlimLLdVlA4ICwAAACwAQCdASoKAAYABUB8JYwAAmcmUBwAAP6e6ZiYN7zKhFr6eqHb8DSYHwAAAA==",
  },
  {
    id: "synchronized-skills",
    name: "Synchronized skills",
    game: "Darkest Dungeon",
    needs: [
      "Loss & Avoidance",
      "Empowerment of Creativity & Feedback",
      "Development & Accomplishment",
      "Scarcity & Impatience",
    ],
    image: "/images/notes/a-workshop-on-video-game-mechanics/synchronized-skills.png",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRnYAAABXRUJQVlA4WAoAAAAQAAAACQAABQAAQUxQSCgAAAABP0CQbeOPeoivGhER1BwUtW0DRWUwJiPTIRn/z4Uhov8pIHlimLLdVlA4ICgAAACwAQCdASoKAAYABUB8JYwAAudlDw5oAP7ukVsDycoXY/FyU9MuAAAA",
  },
  {
    id: "random-card",
    name: "Random card",
    game: "Times Up",
    needs: [
      "Development & Accomplishment",
      "Empowerment of Creativity & Feedback",
      "Social Influence & Relatedness",
      "Unpredictability & Curiosity",
    ],
    image: "/images/notes/a-workshop-on-video-game-mechanics/random-card.png",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRn4AAABXRUJQVlA4WAoAAAAQAAAACQAABQAAQUxQSCcAAAABPyAQSPxB12iNiIingaK2baCoDMZkZDok4/+5MET0PwUkTwxTthsAVlA4IDAAAADQAQCdASoKAAYABUB8JYgAAxew3YyuAAD85T2zyCDcHf6VahqsPiWXUhRY/J38AAA=",
  },
  {
    id: "pick-3",
    name: "Pick 3",
    game: "Ball x Pit",
    needs: [
      "Development & Accomplishment",
      "Ownership & Possession",
      "Unpredictability & Curiosity",
      "Loss & Avoidance",
    ],
    image: "/images/notes/a-workshop-on-video-game-mechanics/pick-3.png",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRmwAAABXRUJQVlA4WAoAAAAQAAAACQAABQAAQUxQSCgAAAABP0CQbeOPeoivGhER1BwUtW0DRWUwJiPTIRn/z4Uhov8pIHlimLLdVlA4IB4AAAAwAQCdASoKAAYABUB8JaQAA3AA/vC05awIhNFGAAA=",
  },
  {
    id: "mystery-loot",
    name: "Mystery loot",
    game: "Mario Kart 8",
    needs: [
      "Ownership & Possession",
      "Social Influence & Relatedness",
      "Unpredictability & Curiosity",
    ],
    image: "/images/notes/a-workshop-on-video-game-mechanics/mystery-loot.png",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRoQAAABXRUJQVlA4WAoAAAAQAAAACQAABQAAQUxQSCgAAAABP0CQbeOPeoivGhER1BwUtW0DRWUwJiPTIRn/z4Uhov8pIHlimLLdVlA4IDYAAADwAQCdASoKAAYABUB8JbACdAEWtVkNdQAA8nKb6xijQCbmD3COZIpYD0Qc4OeMJ3ENnwcboAA=",
  },
  {
    id: "furnishment-list",
    name: "Furnishment list",
    game: "The Sims",
    needs: [
      "Ownership & Possession",
      "Empowerment of Creativity & Feedback",
      "Development & Accomplishment",
    ],
    image: "/images/notes/a-workshop-on-video-game-mechanics/furnishment-list.png",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRngAAABXRUJQVlA4WAoAAAAQAAAACQAABQAAQUxQSCgAAAABP0CQbeOPeoivGhER1BwUtW0DRWUwJiPTIRn/z4Uhov8pIHlimLLdVlA4ICoAAACwAQCdASoKAAYABUB8JQAAS0Gfp4oAAP4uInOgh2hZ87A1yleBGyFiBAA=",
  },
];

function MechanicCard({ mechanic, index }: { mechanic: Mechanic; index: number }) {
  return (
    <li
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${mechanics.length}`}
      className="flex w-[260px] shrink-0 flex-col items-start gap-3 overflow-hidden rounded-lg bg-bg-secondary p-2 sm:w-[280px]"
    >
      <div className="relative aspect-[1000/562] w-full shrink-0 overflow-hidden rounded-md">
        <Image
          src={mechanic.image}
          alt={`Screenshot of the ${mechanic.name} mechanic in ${mechanic.game}`}
          fill
          draggable={false}
          placeholder="blur"
          blurDataURL={mechanic.imageBlurDataURL}
          sizes="(min-width: 640px) 280px, 260px"
          className="object-cover"
        />
      </div>
      <div className="flex w-full flex-col items-start gap-1 px-2">
        <p className="w-full font-body text-xl font-semibold text-text-primary">
          {mechanic.name}
        </p>
        <p className="w-full font-body text-base text-text-secondary">
          {mechanic.game}
        </p>
      </div>
      <ul className="flex flex-col items-start gap-2">
        {mechanic.needs.map((need) => (
          <li key={need}>
            <Tag size="md">{need}</Tag>
          </li>
        ))}
      </ul>
    </li>
  );
}

// When an arrow is pressed after a free drag, the current offset may
// already sit close to the very next card (the drag stopped just short of
// it). Landing exactly on it would then barely move anything, so once the
// remaining gap is under this fraction of the step, aim one card further.
const CLOSE_STEP_RATIO = 0.33;

/** The mechanics each designer named in the workshop, mapped to the
 * Octalysis needs they picked. A keyboard-, mouse- and touch-accessible
 * carousel: arrow buttons slide by one card (or two, when a click would
 * otherwise barely move because a drag already left it close to the next
 * card), and the track can also be click-and-dragged directly — like
 * panning a Figma canvas — landing wherever it's dropped rather than
 * snapping back to a card. Sized to the note's text column, with
 * overflowing cards spilling past the edge rather than being clipped or
 * scrolled with a scrollbar. Each card is a proper list item so assistive
 * tech announces "item N of 7". */
export default function MechanicsCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [offset, setOffset] = useState(0);
  const [cardOffsets, setCardOffsets] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ pointerId: number; startX: number; startOffset: number } | null>(
    null
  );

  const measure = () => {
    const track = trackRef.current;
    if (!track) return;
    setCardOffsets(Array.from(track.children).map((child) => (child as HTMLElement).offsetLeft));
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const maxOffset = cardOffsets[cardOffsets.length - 1] ?? 0;
  const hasMeasured = cardOffsets.length > 0;
  const isAtStart = offset <= 0.5;
  const isAtEnd = hasMeasured && offset >= maxOffset - 0.5;

  const clampOffset = (value: number) => Math.max(0, Math.min(value, maxOffset));

  // Step to the next/previous card, skipping an extra one when the current
  // offset is already close enough to the immediate neighbor.
  const step = (direction: 1 | -1) => {
    if (cardOffsets.length === 0) return;
    const last = cardOffsets.length - 1;

    if (direction === 1) {
      let floor = 0;
      for (let i = 0; i <= last; i++) {
        if (cardOffsets[i] <= offset + 0.5) floor = i;
      }
      let target = Math.min(floor + 1, last);
      const gap = cardOffsets[target] - cardOffsets[floor];
      const remaining = cardOffsets[target] - offset;
      if (target < last && gap > 0 && remaining / gap < CLOSE_STEP_RATIO) {
        target = Math.min(target + 1, last);
      }
      setOffset(cardOffsets[target]);
    } else {
      let ceil = last;
      for (let i = last; i >= 0; i--) {
        if (cardOffsets[i] >= offset - 0.5) ceil = i;
      }
      let target = Math.max(ceil - 1, 0);
      const gap = cardOffsets[ceil] - cardOffsets[target];
      const remaining = offset - cardOffsets[target];
      if (target > 0 && gap > 0 && remaining / gap < CLOSE_STEP_RATIO) {
        target = Math.max(target - 1, 0);
      }
      setOffset(cardOffsets[target]);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { pointerId: e.pointerId, startX: e.clientX, startOffset: offset };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const delta = e.clientX - drag.startX;
    setOffset(clampOffset(drag.startOffset - delta));
  };

  const endDrag = (e: React.PointerEvent<HTMLUListElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    // No snapping: wherever the drag lands is the new position.
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Mechanics named by designers in the workshop"
      className="w-full overflow-visible"
    >
      <div className="flex w-full items-center justify-end gap-2 pb-3">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={isAtStart}
          aria-label="Previous mechanic"
          className="flex shrink-0 select-none items-center justify-center rounded-full bg-bg-tertiary p-3 text-text-primary transition-colors duration-150 hover:bg-[#525252] disabled:pointer-events-none disabled:opacity-40"
        >
          <Icon name="chevron_left" aria-hidden size={24} />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={isAtEnd}
          aria-label="Next mechanic"
          className="flex shrink-0 select-none items-center justify-center rounded-full bg-bg-tertiary p-3 text-text-primary transition-colors duration-150 hover:bg-[#525252] disabled:pointer-events-none disabled:opacity-40"
        >
          <Icon name="chevron_right" aria-hidden size={24} />
        </button>
      </div>

      <div className="w-full overflow-visible">
        <ul
          ref={trackRef}
          tabIndex={0}
          data-cursor="drag"
          aria-label="Mechanics named by designers in the workshop"
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{
            transform: `translateX(-${offset}px)`,
            touchAction: "pan-y",
          }}
          className={`flex w-max list-none select-none gap-4 ease-out ${
            isDragging ? "cursor-grabbing" : "cursor-grab transition-transform duration-300"
          }`}
        >
          {mechanics.map((mechanic, index) => (
            <MechanicCard key={mechanic.id} mechanic={mechanic} index={index} />
          ))}
        </ul>
      </div>
    </div>
  );
}
