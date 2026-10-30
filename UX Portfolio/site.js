const galleryDialog = document.createElement("dialog");
galleryDialog.className = "gallery-dialog";
galleryDialog.setAttribute("aria-label", "Image preview");
galleryDialog.innerHTML = `
  <button class="gallery-dialog-close" type="button" aria-label="Close image preview">&times;</button>
  <figure>
    <img alt="">
    <figcaption></figcaption>
  </figure>
`;
document.body.append(galleryDialog);

if (document.body.classList.contains("case-study-page")) {
  document.querySelectorAll("[data-gallery]").forEach((trigger) => {
    trigger.removeAttribute("data-gallery");
    if (!trigger.matches("button")) return;

    const imageGroup = document.createElement("div");
    imageGroup.className = trigger.className;
    imageGroup.append(...trigger.childNodes);
    trigger.replaceWith(imageGroup);
    imageGroup.querySelectorAll("img").forEach((image) => {
      image.removeAttribute("data-gallery");
      image.removeAttribute("role");
      image.removeAttribute("tabindex");
      image.removeAttribute("aria-label");
    });
  });
}

const galleryImage = galleryDialog.querySelector("img");
const galleryCaption = galleryDialog.querySelector("figcaption");

const openGallery = (trigger) => {
  if (!trigger) return;

  const image = trigger.matches("img") ? trigger : trigger.querySelector("img");
  if (!image) return;

  galleryImage.src = trigger.dataset.full || image.currentSrc || image.src;
  galleryImage.alt = image.alt;
  galleryCaption.textContent = image.alt;
  galleryDialog.showModal();
};

document.querySelectorAll("img[data-gallery]").forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  if (image.alt) image.setAttribute("aria-label", `View image: ${image.alt}`);
});

document.addEventListener("click", (event) => {
  if (document.body.classList.contains("case-study-page")) return;
  openGallery(event.target.closest("[data-gallery]"));
});

document.addEventListener("keydown", (event) => {
  if (document.body.classList.contains("case-study-page")) return;
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("img[data-gallery]")) {
    event.preventDefault();
    openGallery(event.target);
  }
});

galleryDialog.addEventListener("click", (event) => {
  if (event.target === galleryDialog || event.target.closest(".gallery-dialog-close")) {
    galleryDialog.close();
  }
});
