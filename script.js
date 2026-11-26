(() => {
  const music = document.getElementById("music");
  const enter = document.getElementById("enter");
  const backTop = document.getElementById("back-top");
  const letter = document.getElementById("carta");
  const fireworks = document.getElementById("fireworks");
  const fireworksStage = document.getElementById("fireworks-stage");
  const finalSky = document.getElementById("final-sky");
  let fireworksStarted = false;

  enter?.addEventListener("click", async () => {
    if (music) {
      music.volume = 0.55;
      try { await music.play(); } catch (error) {
        console.info("A música poderá ser iniciada pelo controle de reprodução do navegador.");
      }
    }
    document.getElementById("cosmos")?.scrollIntoView({ behavior: "smooth" });
  });

  backTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Revela os elementos suavemente conforme a pessoa percorre a história.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
  }

  // Os parágrafos da carta aparecem um a um enquanto ela entra na tela.
  const paragraphs = [...document.querySelectorAll(".letter-body p")];
  if ("IntersectionObserver" in window) {
    const letterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = paragraphs.indexOf(entry.target);
          window.setTimeout(() => entry.target.classList.add("revealed"), Math.max(0, index) * 180);
          letterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    paragraphs.forEach((p) => letterObserver.observe(p));
  } else {
    paragraphs.forEach((p) => p.classList.add("revealed"));
  }

  // Ao chegar ao final da carta, os fogos começam sem áudio.
  const lastLetterParagraph = paragraphs[paragraphs.length - 1];
  if (lastLetterParagraph && "IntersectionObserver" in window) {
    const finaleObserver = new IntersectionObserver(async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !fireworksStarted) {
          fireworksStarted = true;
          fireworksStage?.classList.add("playing");
          if (fireworks) {
            fireworks.muted = true;
            fireworks.volume = 0;
            try {
              await fireworks.play();
              fireworks.addEventListener("ended", showFinalPhrase, { once: true });
            } catch (error) {
              showFinalPhrase();
            }
          } else {
            showFinalPhrase();
          }
          finaleObserver.disconnect();
        }
      }
    }, { threshold: 0.35 });
    finaleObserver.observe(lastLetterParagraph);
  } else {
    showFinalPhrase();
  }

  function showFinalPhrase() {
    window.setTimeout(() => finalSky?.classList.add("visible"), 900);
  }

  // Mantém todos os vídeos de lembrança silenciosos, mesmo se o controle de volume mudar.
  document.querySelectorAll(".memory-video video").forEach((video) => {
    video.muted = true;
    video.addEventListener("volumechange", () => { video.muted = true; });
  });
})();
