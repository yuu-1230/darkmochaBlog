import { ComponentPropsWithoutRef } from "react";
import dynamic from "next/dynamic";

const ImageSlider = dynamic(() => import("@/components/ImageSlider"));

export const mediaComponents = {
  ImageSlider,
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <ImageSlider
      images={typeof props.src === "string" ? props.src : ""}
      alt={props.alt}
    />
  ),
};
