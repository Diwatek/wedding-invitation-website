import Image from "next/image";
import { imagePath } from "@/data/wedding";

export function WeddingFilm() {
  return (
    <section className="section-block" id="wedding-film">
      <p className="eyebrow">Wedding film preview</p>
      <h2>Wedding Film</h2>
      <div className="film-frame">
        <Image
          src={imagePath("wedding-film-poster")}
          alt="Wedding film preview poster for a fictional Filipino Christian wedding"
          fill
          sizes="(max-width: 900px) 100vw, 900px"
        />
      </div>
      <p>
        A local wedding highlight video can be added to this section for a real
        deployment.
      </p>
      <p>
        Future file path: <code>public/videos/wedding-highlight.mp4</code>.
        When added, the video should use controls, playsInline,
        preload=&quot;metadata&quot;, a poster, and captions when dialogue is
        meaningful.
      </p>
    </section>
  );
}
