import "./brand/fonts";
import { Composition } from "remotion";
import { reel, sec } from "./brand/theme";
import { MORPH_TEST_SECONDS, MorphTest } from "./compositions/MorphTest";
import { RACING_MIND_SECONDS, RacingMind } from "./compositions/RacingMind";
import { BOARD_PANELS, RacingMindBoard } from "./compositions/RacingMindBoard";
import { END_BOARD_PANELS, RacingMindEndBoard } from "./compositions/RacingMindEndBoard";
import { COVER_OPTIONS, RacingMindCovers } from "./compositions/RacingMindCovers";
import { BED_LEARNED_IT_SECONDS, BedLearnedIt } from "./compositions/BedLearnedIt";
import { BOARD_PANELS as BED_BOARD_PANELS, BedLearnedItBoard } from "./compositions/BedLearnedItBoard";
import { COVER_OPTIONS as BED_COVER_OPTIONS, BedLearnedItCovers } from "./compositions/BedLearnedItCovers";
import { BedLearnedItStyles, STYLE_OPTIONS as BED_STYLE_OPTIONS } from "./compositions/BedLearnedItStyles";
import { PICTURE_A_PLACE_SECONDS, PictureAPlace } from "./compositions/PictureAPlace";
import { BOARD_PANELS as PAP_BOARD_PANELS, PictureAPlaceBoard } from "./compositions/PictureAPlaceBoard";
import { COVER_OPTIONS as PAP_COVER_OPTIONS, PictureAPlaceCovers } from "./compositions/PictureAPlaceCovers";
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
      <Composition id="BedLearnedIt" component={BedLearnedIt} durationInFrames={sec(BED_LEARNED_IT_SECONDS)} {...reel} />
      <Composition id="BedLearnedItBoard" component={BedLearnedItBoard} durationInFrames={BED_BOARD_PANELS} {...reel} />
      <Composition id="BedLearnedItCovers" component={BedLearnedItCovers} durationInFrames={BED_COVER_OPTIONS} {...reel} />
      <Composition id="BedLearnedItStyles" component={BedLearnedItStyles} durationInFrames={BED_STYLE_OPTIONS} {...reel} />
      <Composition id="PictureAPlace" component={PictureAPlace} durationInFrames={sec(PICTURE_A_PLACE_SECONDS)} {...reel} />
      <Composition id="PictureAPlaceBoard" component={PictureAPlaceBoard} durationInFrames={PAP_BOARD_PANELS} {...reel} />
      <Composition id="PictureAPlaceCovers" component={PictureAPlaceCovers} durationInFrames={PAP_COVER_OPTIONS} {...reel} />
      <Composition id="TemplatePreview" component={TemplatePreview} durationInFrames={sec(TEMPLATE_PREVIEW_SECONDS)} {...reel} />
      <Composition id="StyleFrames" component={StyleFrames} durationInFrames={4} {...reel} />
    </>
  );
};
