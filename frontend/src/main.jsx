import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_BASE_URL = "http://localhost:8080/api";

const moduleData = {
  user: {
    kicker: "Resident portal",
    title: "User Module",
    description:
      "Users register, request pickups, upload plastic details, track rewards, and view verified collection history.",
    cards: [
      ["Smart registration", "Profile, address, pickup slot, and household collection history."],
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
      "Administrators manage users, collectors, reward partners, material rates, issue resolution, and reports.",
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
      "The system calculates landfill diversion, recycling throughput, CO2e savings, and participation trends.",
    cards: [
      ["CO2e estimates", "Approximate emissions avoided through verified recycling activity."],
      ["Diversion dashboard", "Track plastic prevented from reaching landfills and drains."],
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

const fallbackStats = [
  ["12,840 kg", "Plastic collected"],
  ["48,210", "Reward points issued"],
  ["31.6 t", "CO2e avoided"],
  ["86%", "Collection success"]
];

const rates = {
  "PET bottles": 12,
  "HDPE containers": 14,
  "Mixed household plastic": 9,
  "Packaging film": 7
};

const iconClasses = {
  user: "user",
  collector: "collector",
  admin: "shield",
  reward: "reward",
  impact: "impact",
  community: "people"
};

function App() {
  const [selectedModule, setSelectedModule] = useState("user");
  const [modules, setModules] = useState(moduleData);
  const [dashboardStats, setDashboardStats] = useState(fallbackStats);
  const [dark, setDark] = useState(false);
  const [request, setRequest] = useState({
    area: "Green Street Ward 4",
    weight: 6,
    type: "PET bottles",
    assigned: false
  });

  const selected = modules[selectedModule];
  const rewardPoints = useMemo(() => request.weight * rates[request.type], [request]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/stats`)
      .then((response) => response.json())
      .then((items) => setDashboardStats(items.map((item) => [item.value, item.label])))
      .catch(() => setDashboardStats(fallbackStats));

    fetch(`${API_BASE_URL}/modules`)
      .then((response) => response.json())
      .then((items) => {
        const merged = { ...moduleData };
        items.forEach((item) => {
          if (merged[item.key]) {
            merged[item.key] = {
              ...merged[item.key],
              title: item.title,
              description: item.description,
              cards: item.features.map((feature) => [feature, `${feature} support for the ${item.title}.`])
            };
          }
        });
        setModules(merged);
      })
      .catch(() => setModules(moduleData));
  }, []);

  function updateRequest(field, value) {
    setRequest((current) => ({
      ...current,
      [field]: field === "weight" ? Number(value) : value,
      assigned: false,
      serverMessage: undefined,
      serverPoints: undefined
    }));
  }

  async function submitPickup(event) {
    event.preventDefault();
    const payload = {
      area: request.area,
      weightKg: request.weight,
      plasticType: request.type
    };

    try {
      const response = await fetch(`${API_BASE_URL}/pickups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const created = await response.json();
      setRequest((current) => ({
        ...current,
        assigned: true,
        serverMessage: created.message,
        serverPoints: created.estimatedRewardPoints
      }));
    } catch {
      setRequest((current) => ({ ...current, assigned: true }));
    }
  }

  return (
    <div className={dark ? "app dark" : "app"}>
      <header className="topbar">
        <a className="brand" href="#home" aria-label="PLASTITRACK home">
          <span className="brand-mark">PT</span>
          <span>PLASTITRACK</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#modules">Modules</a>
          <a href="#impact">Impact</a>
          <a href="#community">Community</a>
        </nav>
        <button className="icon-button" type="button" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">
          <span className="icon moon" aria-hidden="true"></span>
        </button>
      </header>

      <main id="home">
        <section className="hero" aria-labelledby="hero-title">
          <img src="/assets/plastitrack-hero.png" alt="Community plastic collection and redemption station" />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <p className="eyebrow">Community-driven waste recovery</p>
            <h1 id="hero-title">PLASTITRACK</h1>
            <p>
              A plastic waste collection and redemption platform that connects residents, collectors,
              administrators, rewards, environmental tracking, and local community action.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#pickup">Schedule Pickup</a>
              <a className="secondary-action" href="#modules">View Modules</a>
            </div>
          </div>
        </section>

        <section className="dashboard" aria-label="Live platform snapshot">
          {dashboardStats.map(([value, label]) => (
            <article key={label}>
              <span className="metric-value">{value}</span>
              <span className="metric-label">{label}</span>
            </article>
          ))}
        </section>

        <section className="workspace">
          <aside className="module-rail" id="modules" aria-label="System modules">
            <h2>Modules</h2>
            {Object.entries(modules).map(([key, module]) => (
              <button
                className={selectedModule === key ? "module-tab active" : "module-tab"}
                type="button"
                key={key}
                onClick={() => setSelectedModule(key)}
              >
                <span className={`icon ${iconClasses[key]}`} aria-hidden="true"></span>
                {module.title}
              </button>
            ))}
          </aside>

          <section className="module-panel" aria-live="polite">
            <div>
              <p className="eyebrow">{selected.kicker}</p>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
            </div>
            <div className="module-grid">
              {selected.cards.map(([title, body]) => (
                <article className="module-card" key={title}>
                  <strong>{title}</strong>
                  <span>{body}</span>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="operations">
          <form className="pickup-form" id="pickup" onSubmit={submitPickup} aria-label="Schedule a plastic pickup">
            <div>
              <p className="eyebrow">Collection request</p>
              <h2>Schedule a Pickup</h2>
            </div>
            <label>
              Area
              <input value={request.area} onChange={(event) => updateRequest("area", event.target.value)} required />
            </label>
            <label>
              Plastic weight in kg
              <input
                type="number"
                min="1"
                value={request.weight}
                onChange={(event) => updateRequest("weight", event.target.value)}
                required
              />
            </label>
            <label>
              Plastic type
              <select value={request.type} onChange={(event) => updateRequest("type", event.target.value)}>
                {Object.keys(rates).map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <button className="primary-action" type="submit">Create Request</button>
          </form>

          <section className="request-preview" aria-label="Request preview">
            <p className="eyebrow">Estimated redemption</p>
            <h2>{(request.serverPoints ?? rewardPoints).toLocaleString("en-IN")} points</h2>
            <p>
              {request.serverMessage ??
                `Pickup for ${request.weight} kg of ${request.type.toLowerCase()} in ${request.area}. A nearby collector can accept and verify the load.`}
            </p>
            <div className="status-track" aria-label="Collection status">
              <span className="done">Requested</span>
              <span className={request.assigned ? "done" : ""}>Assigned</span>
              <span>Verified</span>
              <span>Redeemed</span>
            </div>
          </section>
        </section>

        <section className="impact-band" id="impact">
          <div>
            <p className="eyebrow">Environmental Impact Module</p>
            <h2>Measure every kilogram beyond collection.</h2>
            <p>
              PLASTITRACK estimates avoided landfill load, material recovery, CO2e savings, and neighborhood
              participation to keep environmental reporting transparent.
            </p>
          </div>
          <div className="impact-bars" aria-label="Impact progress">
            <label><span>Landfill diversion</span><meter min="0" max="100" value="78"></meter></label>
            <label><span>Verified recycling</span><meter min="0" max="100" value="64"></meter></label>
            <label><span>Community participation</span><meter min="0" max="100" value="83"></meter></label>
          </div>
        </section>

        <section className="community" id="community">
          <div>
            <p className="eyebrow">Community Module</p>
            <h2>Neighborhood actions</h2>
          </div>
          <article><strong>Saturday Clean Drive</strong><span>24 volunteers registered, 190 kg target</span></article>
          <article><strong>School Bottle Bank</strong><span>Reward pool sponsored for student teams</span></article>
          <article><strong>Market Zone Sorting Camp</strong><span>Collector training and on-site verification</span></article>
        </section>
      </main>

      <footer>
        <span>PLASTITRACK</span>
        <span>Plastic collection, verified impact, real rewards.</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
