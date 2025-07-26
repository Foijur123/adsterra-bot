const puppeteer = require("puppeteer");
const axios = require("axios");

// Adsterra Direct Link
const adLink = "https://www.profitableratecpm.com/k39r5793y4?key=b1bce4882d9777e4abc00382972db0ff";

// Top Earning Countries
const targetCountries = ["US", "UK", "CA", "DE", "AU"];

// Generate Random Mobile/Desktop User Agent
function randomUserAgent() {
  const desktop = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
  ];
  const mobile = [
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36"
  ];
  return Math.random() > 0.5 ? desktop[Math.floor(Math.random() * desktop.length)] : mobile[Math.floor(Math.random() * mobile.length)];
}

// Get Free Proxy List (US/UK/CA/DE/AU)
async function getProxies() {
  try {
    const res = await axios.get("https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=7000&country=US,UK,CA,DE,AU");
    const proxies = res.data.split("\n").filter(p => p.includes(":"));
    console.log(`🌍 Loaded ${proxies.length} high-quality proxies.`);
    return proxies;
  } catch (e) {
    console.log("Proxy fetch error:", e.message);
    return [];
  }
}

// Visit Link
async function visitLink(proxy = null) {
  let launchOptions = { headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] };
  if (proxy) launchOptions.args.push(`--proxy-server=http://${proxy}`);

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  try {
    await page.setUserAgent(randomUserAgent());
    await page.goto(adLink, { waitUntil: "domcontentloaded", timeout: 30000 });
    console.log(`✅ Visit Success via ${proxy || "Direct"}`);
  } catch (e) {
    console.log(`❌ Visit Failed: ${e.message}`);
  } finally {
    await browser.close();
  }
}

// Start Bot
async function startBot() {
  const proxies = await getProxies();
  setInterval(() => {
    const proxy = proxies.length > 0 ? proxies[Math.floor(Math.random() * proxies.length)] : null;
    visitLink(proxy);
  }, 5000); // Every 5 seconds
}

startBot();
console.log("🚀 Ultimate Bot Started! Targeting high-earning countries (US, UK, CA, DE, AU)...");