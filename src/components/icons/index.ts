import ArrowBackIcon from "./ArrowBackIcon";
import ArrowForwardIcon from "./ArrowForwardIcon";
import ArrowRangeIcon from "./ArrowRangeIcon";
import BlockIcon from "./BlockIcon";
import CancelIcon from "./CancelIcon";
import CheckIcon from "./CheckIcon";
import ChevronLeftIcon from "./ChevronLeftIcon";
import ChevronRightIcon from "./ChevronRightIcon";
import CloseIcon from "./CloseIcon";
import ContentCopyIcon from "./ContentCopyIcon";
import ImageIcon from "./ImageIcon";
import ExpandMoreIcon from "./ExpandMoreIcon";
import MusicNoteIcon from "./MusicNoteIcon";
import PauseIcon from "./PauseIcon";
import PlayArrowIcon from "./PlayArrowIcon";
import SentimentSatisfiedIcon from "./SentimentSatisfiedIcon";
import ScheduleIcon from "./ScheduleIcon";
import SearchIcon from "./SearchIcon";
import AiSearchIcon from "./AiSearchIcon";

export const icons = {
  arrow_back: ArrowBackIcon,
  arrow_forward: ArrowForwardIcon,
  arrow_range: ArrowRangeIcon,
  block: BlockIcon,
  cancel: CancelIcon,
  check: CheckIcon,
  chevron_left: ChevronLeftIcon,
  chevron_right: ChevronRightIcon,
  close: CloseIcon,
  content_copy: ContentCopyIcon,
  image: ImageIcon,
  expand_more: ExpandMoreIcon,
  music_note: MusicNoteIcon,
  pause: PauseIcon,
  play_arrow: PlayArrowIcon,
  sentiment_satisfied: SentimentSatisfiedIcon,
  schedule: ScheduleIcon,
  search: SearchIcon,
  ai_search: AiSearchIcon,
};

export type IconName = keyof typeof icons;
