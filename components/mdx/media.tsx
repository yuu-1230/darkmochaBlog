import { ComponentPropsWithoutRef } from "react";
import ImageSlider from "@/components/ImageSlider";

export const mediaComponents = {
  ImageSlider,
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <ImageSlider images={typeof props.src === "string" ? props.src : ""} />
  ),
};
