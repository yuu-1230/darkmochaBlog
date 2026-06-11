import Image from "next/image";

export function HeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-full h-56 md:h-72 relative rounded-xl overflow-hidden mb-8 -mx-4 md:mx-0" style={{ width: "calc(100% + 2rem)" }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
    </div>
  );
}
