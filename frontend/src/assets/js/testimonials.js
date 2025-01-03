export function testimonials() {
  const track = document.querySelector(".gallery");

  const handleOnDown = (e) => {
    track.dataset.mouseDownAt = e.clientX || 0;
  };

  const handleOnUp = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage || "0";
  };

  const handleOnMove = (e) => {
    if (track.dataset.mouseDownAt === "0") return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - (e.clientX || 0);
    const maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100;
    const prevPercentage = parseFloat(track.dataset.prevPercentage) || 0;
    const nextPercentageUnconstrained = prevPercentage + percentage;
    const maxScrollPercentage =
      (-(track.scrollWidth - track.clientWidth) / track.clientWidth) * 100;

    const nextPercentage = Math.max(
      Math.min(nextPercentageUnconstrained, 0),
      maxScrollPercentage
    );

    track.dataset.percentage = nextPercentage;

    track.animate(
      {
        transform: `translate(${
          isNaN(nextPercentage) ? 0 : nextPercentage
        }%, 0)`,
      },
      { duration: 1200, fill: "forwards" }
    );

    for (const image of track.querySelectorAll(".testimonial-gallery-img")) {
      image.animate(
        {
          objectPosition: `${
            isNaN(nextPercentage) ? 100 : 100 + nextPercentage / 2
          }% center`,
        },
        { duration: 1200, fill: "forwards" }
      );
    }
  };

  window.onmousedown = (e) => handleOnDown(e);

  window.ontouchstart = (e) => handleOnDown(e.touches[0]);

  window.onmouseup = (e) => handleOnUp(e);

  window.ontouchend = (e) => handleOnUp(e.touches[0]);

  window.onmousemove = (e) => handleOnMove(e);

  window.ontouchmove = (e) => handleOnMove(e.touches[0]);
}
