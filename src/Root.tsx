import "./brand/fonts";
import { Composition } from "remotion";
import { reel, sec } from "./brand/theme";
import { MORPH_TEST_SECONDS, MorphTest } from "./compositions/MorphTest";
import { RACING_MIND_SECONDS, RacingMind } from "./compositions/RacingMind";
import { BOARD_PANELS, RacingMindBoard } from "./compositions/RacingMindBoard";
import { END_BOARD_PANELS, RacingMindEndBoard } from "./compositions/RacingMindEndBoard";
import { COVER_OPTIONS, RacingMindCovers } from "./compositions/RacingMindCovers";
import { StyleFrames } from "./compositions/StyleFrames";
import { TEMPLATE_PREVIEW_SECONDS, TemplatePreview } from "./compositions/TemplatePreview";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="MorphTest" component={MorphTest} durationInFrames={sec(MORPH_TEST_SECONDS)} {...reel} defaultProps={{ layout: "left" as const }} />
      <Composition id="MorphTest-Center" component={MorphTest} durationInFrames={sec(MORPH_TEST_SECONDS)} {...reel} defaultProps={{ layout: "center" as const }} />
      <Composition id="MorphTest-Swap" component={MorphTest} durationInFrames={sec(MORPH_TEST_SECONDS)} {...reel} defaultProps={{ layout: "swap" as const }} />
      <Composition id="RacingMind" component={RacingMind} durationInFrames={sec(RACING_MIND_SECONDS)} {...reel} defaultProps={{ supers: true }} />
      <Composition id="RacingMind-Textless" component={RacingMind} durationInFrames={sec(RACING_MIND_SECONDS)} {...reel} defaultProps={{ supers: false }} />
      <Composition id="RacingMindBoard" component={RacingMindBoard} durationInFrames={BOARD_PANELS} {...reel} />
      <Composition id="RacingMindCovers" component={RacingMindCovers} durationInFrames={COVER_OPTIONS} {...reel} />
      <Composition id="RacingMindEndBoard" component={RacingMindEndBoard} durationInFrames={END_BOARD_PANELS} {...reel} />
      <Composition id="TemplatePreview" component={TemplatePreview} durationInFrames={sec(TEMPLATE_PREVIEW_SECONDS)} {...reel} />
      <Composition id="StyleFrames" component={StyleFrames} durationInFrames={4} {...reel} />
    </>
  );
};
