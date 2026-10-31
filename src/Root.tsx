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
import { WARM_SHOWER_SECONDS, WarmShower } from "./compositions/WarmShower";
import { BOARD_PANELS as WS_BOARD_PANELS, WarmShowerBoard } from "./compositions/WarmShowerBoard";
import { COVER_OPTIONS as WS_COVER_OPTIONS, WarmShowerCovers } from "./compositions/WarmShowerCovers";
import { STAY_AWAKE_SECONDS, StayAwake } from "./compositions/StayAwake";
import { StayAwakeTestA, StayAwakeTestB, StayAwakeTestC, TEST_SECONDS } from "./compositions/StayAwakeTests";
import { BOARD_PANELS as SA_BOARD_PANELS, StayAwakeBoard } from "./compositions/StayAwakeBoard";
import { COVER_OPTIONS as SA_COVER_OPTIONS, StayAwakeCovers } from "./compositions/StayAwakeCovers";
import { CLOCK_WATCHER_SECONDS, ClockWatcher } from "./compositions/ClockWatcher";
import { BOARD_PANELS as CW_BOARD_PANELS, ClockWatcherBoard } from "./compositions/ClockWatcherBoard";
import { COVER_OPTIONS as CW_COVER_OPTIONS, ClockWatcherCovers } from "./compositions/ClockWatcherCovers";
import { COGNITIVE_SHUFFLE_SECONDS, CognitiveShuffle } from "./compositions/CognitiveShuffle";
import { COVER_OPTIONS as CS_COVER_OPTIONS, CognitiveShuffleCovers } from "./compositions/CognitiveShuffleCovers";
import { BOARD_PANELS as CS_BOARD_PANELS, CognitiveShuffleBoard } from "./compositions/CognitiveShuffleBoard";
import { BODY_CLOCK_SECONDS, BodyClock } from "./compositions/BodyClock";
import { BOARD_PANELS as BCF_BOARD_PANELS, BodyClockFixBoard } from "./compositions/BodyClockFixBoard";
import { COVER_OPTIONS as BC_COVER_OPTIONS, BodyClockCovers } from "./compositions/BodyClockCovers";
import { BOARD_PANELS as BC_BOARD_PANELS, BodyClockBoard } from "./compositions/BodyClockBoard";
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
      <Composition id="WarmShower" component={WarmShower} durationInFrames={sec(WARM_SHOWER_SECONDS)} {...reel} />
      <Composition id="WarmShowerBoard" component={WarmShowerBoard} durationInFrames={WS_BOARD_PANELS} {...reel} />
      <Composition id="WarmShowerCovers" component={WarmShowerCovers} durationInFrames={WS_COVER_OPTIONS} {...reel} />
      <Composition id="StayAwake" component={StayAwake} durationInFrames={sec(STAY_AWAKE_SECONDS)} {...reel} />
      <Composition id="StayAwakeTestA" component={StayAwakeTestA} durationInFrames={sec(TEST_SECONDS)} {...reel} />
      <Composition id="StayAwakeTestB" component={StayAwakeTestB} durationInFrames={sec(TEST_SECONDS)} {...reel} />
      <Composition id="StayAwakeTestC" component={StayAwakeTestC} durationInFrames={sec(TEST_SECONDS)} {...reel} />
      <Composition id="StayAwakeBoard" component={StayAwakeBoard} durationInFrames={SA_BOARD_PANELS} {...reel} />
      <Composition id="StayAwakeCovers" component={StayAwakeCovers} durationInFrames={SA_COVER_OPTIONS} {...reel} />
      <Composition id="ClockWatcher" component={ClockWatcher} durationInFrames={sec(CLOCK_WATCHER_SECONDS)} {...reel} />
      <Composition id="ClockWatcherBoard" component={ClockWatcherBoard} durationInFrames={CW_BOARD_PANELS} {...reel} />
      <Composition id="ClockWatcherCovers" component={ClockWatcherCovers} durationInFrames={CW_COVER_OPTIONS} {...reel} />
      <Composition id="CognitiveShuffle" component={CognitiveShuffle} durationInFrames={sec(COGNITIVE_SHUFFLE_SECONDS)} {...reel} />
      <Composition id="CognitiveShuffleCovers" component={CognitiveShuffleCovers} durationInFrames={CS_COVER_OPTIONS} {...reel} />
      <Composition id="CognitiveShuffleBoard" component={CognitiveShuffleBoard} durationInFrames={CS_BOARD_PANELS} {...reel} />
      <Composition id="BodyClock" component={BodyClock} durationInFrames={sec(BODY_CLOCK_SECONDS)} {...reel} />
      <Composition id="BodyClockFixBoard" component={BodyClockFixBoard} durationInFrames={BCF_BOARD_PANELS} {...reel} />
      <Composition id="BodyClockCovers" component={BodyClockCovers} durationInFrames={BC_COVER_OPTIONS} {...reel} />
      <Composition id="BodyClockBoard" component={BodyClockBoard} durationInFrames={BC_BOARD_PANELS} {...reel} />
      <Composition id="TemplatePreview" component={TemplatePreview} durationInFrames={sec(TEMPLATE_PREVIEW_SECONDS)} {...reel} />
      <Composition id="StyleFrames" component={StyleFrames} durationInFrames={4} {...reel} />
    </>
  );
};
