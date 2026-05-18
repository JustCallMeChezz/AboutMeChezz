const vibes = [
  "aesthetic",
  "vibing",
  "soft",
  "magical",
  "girlish",
  "wholesome"
];

async function tryFetchQuote(prompt) {
  try {
    const apiUrl =
      "https://api-nanzz.my.id/docs/ai/claude-haiku?text=" +
      encodeURIComponent(prompt + " (no emojis allowed)");

    const proxyUrl =
      "https://corsproxy.io/?" +
      encodeURIComponent(apiUrl + "&_=" + Date.now());

    const res = await fetch(proxyUrl, { cache: "no-store" });

    const data = await res.json();

    let response = data?.result;

    if (response) {
      response = response
        .replace(/^"+|"+$/g, "")
        .replace(/\\u001c\{.*$/g, "")
        .replace(/[\u{1F300}-\u{1FAFF}]/gu, "") 
        .replace(/[\u2600-\u27BF]/gu, "") 
        .trim();

      return `"${response}"`;
    }
  } catch (err) {
    console.log(err);
  }

  return null;
}

async function fetchQuote() {
  const box = document.getElementById("quote-box");
  const dots = document.getElementById("typing-dots");

  box.innerText = "";
  box.classList.remove("loaded");

  dots.style.display = "inline-flex";

  const vibe = vibes[Math.floor(Math.random() * vibes.length)];

  const prompt =
    `generate a cute, ${vibe}, meaningful quote that's only 8 to 12 words long`;

  let quote;

  try {
    quote = await tryFetchQuote(prompt);
  } catch {
    quote = null;
  }

  dots.style.display = "none";

  if (quote) {
    box.classList.remove("loaded");

    setTimeout(() => {
      box.innerText = quote;
      box.classList.add("loaded");
    }, 50);
  } else {
    showFallbackQuotes();
  }
}

async function typeText(element, text, speed = 150) {
  return new Promise((resolve) => {
    let i = 0;

    element.innerHTML = "&nbsp;";
    element.style.transition = "none";
    element.style.maxHeight = "0px";

    requestAnimationFrame(() => {
      element.style.transition = "max-height 0.6s ease";

      element.classList.add("loaded");

      const interval = setInterval(() => {
        element.innerText = text.slice(0, i + 1);
        element.style.maxHeight = element.scrollHeight + "px";

        i++;

        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  });
}

async function fadeOutIn(box, text, stay = 2000) {
  await typeText(box, `"${text}"`);

  await new Promise((r) => setTimeout(r, stay));

  box.style.transition = "opacity 0.8s ease";
  box.style.opacity = 0;

  await new Promise((r) => setTimeout(r, 800));

  box.style.opacity = 1;
}

async function showFallbackQuotes() {
  const box = document.getElementById("quote-box");

  await fadeOutIn(
    box,
    "once i dreamt that we were dear to each other..."
  );

  await fadeOutIn(
    box,
    "i woke to find that we were strangers..."
  );

  await typeText(
    box,
    `"memories are like old servers... abandoned... but still holding worlds you once lived in..."`
  );
}

document.addEventListener("DOMContentLoaded", () => {
  fetchQuote();
});