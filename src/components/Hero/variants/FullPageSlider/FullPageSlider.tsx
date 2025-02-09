import { type FC } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Parallax } from 'swiper/modules';
import { FadeIn } from '../../../animations/FadeIn';
import 'swiper/css';
import 'swiper/css/pagination';
import './FullPageSlider.css';

interface Slide {
    subtitle?: string;
    title: string;
    background: string;
    paragraph?: string;
    button?: {
        text: string;
        link: string;
    };
}

export interface FullPageSliderProps {
    content: Slide[];
}

export const FullPageSlider: FC<FullPageSliderProps> = ({ content }) => {
    if (!content || content.length === 0) {
        return null;
    }

    return (
        <div className="hero-slider fullpage">
            <Swiper
                modules={[Autoplay, Pagination, Parallax]}
                parallax={true}
                pagination={{
                    clickable: true,
                    el: '.hero-pagination',
                    type: 'progressbar',
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                speed={1000}
                loop={true}
                className="hero-swiper"
            >
                {content.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="hero-slide">
                            <img 
                                src={slide.background} 
                                alt={slide.title}
                                className="hero-image"
                                data-swiper-parallax="30%"
                            />
                            <div className="hero-overlay"></div>
                            <div className="hero-content" data-swiper-parallax="-40%">
                                <div className="text-container">
                                    <FadeIn>
                                        {slide.subtitle && (
                                            <div className="hero-subtitle">
                                                {slide.subtitle}
                                            </div>
                                        )}
                                        <h1 className="hero-title">{slide.title}</h1>
                                        {slide.paragraph && (
                                            <p>{slide.paragraph}</p>
                                        )}
                                        {slide.button && (
                                            <a href={slide.button.link} className="cta-button">
                                                {slide.button.text}
                                            </a>
                                        )}
                                    </FadeIn>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                <div className="hero-pagination"></div>
            </Swiper>
        </div>
    );
};
