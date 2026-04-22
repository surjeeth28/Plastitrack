const modules = {
  user: {
    kicker: "Resident portal",
    title: "User Module",
    description:
      "Users register, request pickups, upload plastic details, track rewards, and view verified collection history.",
    cards: [
      ["Smart registration", "Profile, address, preferred pickup slot, and household collection history."],
      ["Pickup booking", "Plastic type, weight, photos, location, and request status in one flow."],
      ["Reward wallet", "Earned points, redemption history, and eligible partner offers."]
    ]
  },
  collector: {
    kicker: "Field operations",
    title: "Collector Module",
    description:
      "Collectors accept pickup jobs, navigate assigned routes, verify plastic loads, and update the collection lifecycle.",
    cards: [
      ["Route queue", "Priority requests grouped by area, weight, and pickup window."],
      ["Load verification", "Weight entry, plastic category confirmation, and photo proof."],
      ["Handover tracking", "Transfer verified plastic to recycling partners with audit records."]
    ]
  },
  admin: {
    kicker: "Platform control",
    title: "Administrator Module",
    description:
      "Administrators manage users, collectors, reward partners, material rates, issue resolution, and system reports.",
    cards: [
      ["User oversight", "Approve collectors, handle complaints, and protect account integrity."],
      ["Rate management", "Configure points per kilogram by plastic category and partner rules."],
      ["Reports", "View collection volume, reward liability, and environmental performance."]
    ]
  },
  reward: {
    kicker: "Redemption engine",
    title: "Reward Management Module",
    description:
      "Reward management converts verified plastic collection into points, vouchers, cashbacks, or community benefits.",
    cards: [
      ["Points calculator", "Automatic point estimation based on verified weight and material category."],
      ["Partner catalog", "Local stores, civic credits, coupons, and sponsored campaign rewards."],
      ["Fraud controls", "Reward release only after collector and administrator verification."]
    ]
  },
  impact: {
    kicker: "Impact intelligence",
    title: "Environmental Impact Module",
    description:
      "The system calculates landfill diversion, recycling throughput, CO2e savings, and neighborhood participation trends.",
    cards: [
      ["CO2e estimates", "Approximate emissions avoided through verified recycling activity."],
      ["Diversion dashboard", "Track how much plastic is prevented from reaching landfills and drains."],
      ["Impact certificates", "Share monthly community results with residents and sponsors."]
    ]
  },
  community: {
    kicker: "Local action",
    title: "Community Module",
    description:
      "Community tools support campaigns, leaderboards, cleanup events, awareness drives, and ward-level engagement.",
    cards: [
      ["Events", "Create drives for schools, markets, apartments, and public spaces."],
      ["Leaderboards", "Rank neighborhoods by verified plastic collection and participation."],
      ["Announcements", "Broadcast collection days, sorting tips, and campaign results."]
    ]
  }
};

const moduleTabs = document.querySelectorAll(".module-tab");
const moduleKicker = document.querySelector("#moduleKicker");
const moduleTitle = document.querySelector("#moduleTitle");
const moduleDescription = document.querySelector("#moduleDescription");
const moduleCards = document.querySelector("#moduleCards");
const pickupForm = document.querySelector("#pickup");
const areaInput = document.querySelector("#areaInput");
const weightInput = document.querySelector("#weightInput");
const typeInput = document.querySelector("#typeInput");
const rewardPoints = document.querySelector("#rewardPoints");
const requestSummary = document.querySelector("#requestSummary");
const themeToggle = document.querySelector("#themeToggle");

function renderModule(moduleKey) {
  const selected = modules[moduleKey];
  moduleKicker.textContent = selected.kicker;
  moduleTitle.textContent = selected.title;
  moduleDescription.textContent = selected.description;
  moduleCards.innerHTML = selected.cards
    .map(
      ([title, body]) => `
        <article class="module-card">
          <strong>${title}</strong>
          <span>${body}</span>
        </article>
      `
    )
    .join("");
}

function updateRewardPreview() {
  const weight = Math.max(Number(weightInput.value || 0), 0);
  const rates = {
    "PET bottles": 12,
    "HDPE containers": 14,
    "Mixed household plastic": 9,
    "Packaging film": 7
  };
  const points = weight * rates[typeInput.value];
  rewardPoints.textContent = `${points.toLocaleString("en-IN")} points`;
  requestSummary.textContent = `Pickup for ${weight} kg of ${typeInput.value.toLowerCase()} in ${areaInput.value}. A nearby collector can accept and verify the load.`;
}

moduleTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    moduleTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    renderModule(tab.dataset.module);
  });
});

[areaInput, weightInput, typeInput].forEach((field) => {
  field.addEventListener("input", updateRewardPreview);
});

pickupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateRewardPreview();
  document.querySelectorAll(".status-track span")[1].classList.add("done");
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

renderModule("user");
updateRewardPreview();
