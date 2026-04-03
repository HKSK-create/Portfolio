const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}

// Video hover preview
const videoWrapper = document.querySelector(".video-wrapper");
let preview = null;
let hoverTimer = null;

if (videoWrapper) {
  const originalVideo = videoWrapper.querySelector("video");

  const removePreview = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }

    if (preview) {
      preview.classList.remove("is-visible");

      const previewToRemove = preview;
      preview = null;

      setTimeout(() => {
        if (previewToRemove && previewToRemove.parentNode) {
          previewToRemove.pause();
          previewToRemove.remove();
        }
      }, 180);
    }
  };

  const positionPreview = (e) => {
    if (!preview) return;

    const margin = 20;
    const width = preview.offsetWidth || 650;
    const height = preview.offsetHeight || Math.round(width * 9 / 16);

    let left = e.clientX + 24;
    let top = e.clientY + 24;

    if (left + width > window.innerWidth - margin) {
      left = e.clientX - width - 24;
    }

    if (top + height > window.innerHeight - margin) {
      top = window.innerHeight - height - margin;
    }

    if (top < margin) {
      top = margin;
    }

    if (left < margin) {
      left = margin;
    }

    preview.style.left = `${left}px`;
    preview.style.top = `${top}px`;
  };

  videoWrapper.addEventListener("mouseenter", (e) => {
    hoverTimer = setTimeout(() => {
      if (!originalVideo) return;

      preview = document.createElement("video");
      preview.className = "video-preview";
      preview.muted = true;
      preview.loop = true;
      preview.autoplay = true;
      preview.playsInline = true;

      const source = document.createElement("source");
      source.src =
        originalVideo.currentSrc ||
        originalVideo.querySelector("source")?.src ||
        "";
      source.type = "video/mp4";
      preview.appendChild(source);

      document.body.appendChild(preview);

      positionPreview(e);

      preview.addEventListener("loadeddata", () => {
        try {
          preview.currentTime = originalVideo.currentTime;
        } catch (err) {
          // ignore sync issues
        }

        requestAnimationFrame(() => {
          if (preview) {
            preview.classList.add("is-visible");
          }
        });
      });
    }, 120);
  });

  videoWrapper.addEventListener("mousemove", (e) => {
    if (!preview) return;

    positionPreview(e);

    try {
      const timeDiff = Math.abs(preview.currentTime - originalVideo.currentTime);
      if (timeDiff > 0.35) {
        preview.currentTime = originalVideo.currentTime;
      }
    } catch (err) {
      // ignore sync issues
    }
  });

  videoWrapper.addEventListener("mouseleave", removePreview);
}