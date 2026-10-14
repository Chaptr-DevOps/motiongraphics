import "./brand/fonts";
import { Composition } from "remotion";
import { reel, sec } from "./brand/theme";
import { MORPH_TEST_SECONDS, MorphTest } from "./compositions/MorphTest";
import { StyleFrames } from "./compositions/StyleFrames";
import { TEMPLATE_PREVIEW_SECONDS, TemplatePreview } from "./compositions/TemplatePreview";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="MorphTest" component={MorphTest} durationInFrames={sec(MORPH_TEST_SECONDS)} {...reel} defaultProps={{ layout: "left" as const }} />
      <Composition id="MorphTest-Center" component={MorphTest} durationInFrames={sec(MORPH_TEST_SECONDS)} {...reel} defaultProps={{ layout: "center" as const }} />
      <Composition id="MorphTest-Swap" component={MorphTest} durationInFrames={sec(MORPH_TEST_SECONDS)} {...reel} defaultProps={{ layout: "swap" as const }} />
      <Composition id="TemplatePreview" component={TemplatePreview} durationInFrames={sec(TEMPLATE_PREVIEW_SECONDS)} {...reel} />
      <Composition id="StyleFrames" component={StyleFrames} durationInFrames={4} {...reel} />
    </>
  );
};
