import React, { type FC } from 'react';
import {
    FullPageSlider,
    type FullPageSliderProps,
} from "./variants/FullPageSlider/FullPageSlider";

type HeroProps = {
  heroType: "fullPageSlider";
  data: FullPageSliderProps["content"];
};

export const Hero: FC<HeroProps> = ({ heroType, data }) => {
    if (!data) {
        return null;
    }

    switch (heroType) {
        case "fullPageSlider":
            return <FullPageSlider content={data} />;
        default:
            return null;
    }
};
