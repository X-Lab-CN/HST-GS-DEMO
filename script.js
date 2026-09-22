const data = {
  mip: [
    ["3DGS", "20.93", "27.53", "0.812", "0.221", "2.63M", "146"],
    ["Taming-3DGS", "5.14", "27.48", "0.794", "0.261", "0.68M", "221"],
    ["DashGaussian", "6.38", "27.72", "0.818", "0.217", "2.40M", "155"],
    ["FastGS-Big", "4.98", "27.97", "0.820", "0.216", "1.16M", "284"],
    ["HST-GS (Ours)", "4.73", "27.62", "0.816", "0.217", "1.57M", "313"]
  ],
  deep: [
    ["3DGS", "19.77", "29.71", "0.903", "0.241", "2.46M", "158"],
    ["Taming-3DGS", "3.06", "29.50", "0.894", "0.278", "0.29M", "352"],
    ["DashGaussian", "4.16", "29.65", "0.906", "0.245", "1.94M", "208"],
    ["FastGS-Big", "3.02", "30.15", "0.911", "0.240", "0.65M", "345"],
    ["HST-GS (Ours)", "2.91", "30.26", "0.912", "0.237", "1.03M", "444"]
  ],
  tanks: [
    ["3DGS", "11.34", "23.71", "0.850", "0.170", "1.57M", "195"],
    ["Taming-3DGS", "2.71", "23.89", "0.833", "0.214", "0.32M", "379"],
    ["DashGaussian", "4.29", "23.99", "0.854", "0.178", "1.21M", "240"],
    ["FastGS-Big", "3.07", "24.49", "0.858", "0.174", "0.54M", "308"],
    ["HST-GS (Ours)", "2.73", "23.71", "0.851", "0.180", "0.88M", "446"]
  ]
};

const rows = document.getElementById("comparison-rows");
const tabs = [...document.querySelectorAll(".tab")];
function renderDataset(name) {
  rows.replaceChildren(...data[name].map((cells) => {
    const tr = document.createElement("tr");
    if (cells[0].startsWith("HST-GS")) tr.className = "ours";
    cells.forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.append(td);
    });
    return tr;
  }));
  tabs.forEach((tab) => {
    const selected = tab.dataset.dataset === name;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => renderDataset(tab.dataset.dataset));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].focus();
    renderDataset(tabs[next].dataset.dataset);
  });
});
renderDataset("mip");

document.getElementById("copy-bibtex").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const citation = document.getElementById("bibtex").textContent.trim();
  try {
    await navigator.clipboard.writeText(citation);
    button.textContent = "Copied!";
    window.setTimeout(() => { button.textContent = "Copy citation"; }, 2200);
  } catch {
    button.textContent = "Select text to copy";
    window.setTimeout(() => { button.textContent = "Copy citation"; }, 2800);
  }
});
