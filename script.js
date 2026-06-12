const StartPageLoading = document.querySelector(".StartPageLoading");
const searchInput = document.getElementById("searchInput");
const CarouselMain = document.querySelectorAll(".main__header");
const homePage = document.getElementById("homePage");
const loading = document.querySelector(".loading");
const home = document.getElementById("home");

const leftContainerIcons = document.querySelectorAll(".icons i");
const chartBtns = document.querySelectorAll(".chart_btns button");

const StockTiles = document.getElementById("stocks");
const stockInfoDisplay = document.getElementById("stockInformations");

const searchHints = document.querySelector(".searchHints");
const addToFavoriteBtn = document.getElementById("addToFavorite");
const buyBtn = document.getElementById("buy");
const addStockToPortfolio = document.querySelector(".addStockToPortfolio");

let companyInfoLeft = document.querySelector(".companyInfo__left .logo");
let companyInfoChart = document.querySelector(".companyInfo_chart .logo");
const CompanyNameLeft = document.getElementById("companyName");
const PriceLeft = document.getElementById("price");

const infoDetailsHeadCompanyName = document.getElementById(
  "infoDetailsHeadCompanyName",
);
const infoDetailsHeadCompanyTicker = document.getElementById(
  "infoDetailsHeadCompanyTicker",
);
const chartCompanyName = document.getElementById("chartCompanyName");
const companyDes = document.getElementById("companyDes");
const chartCompanyTicker = document.getElementById("chartCompanyTicker");
const chartCompanyPrice = document.getElementById("chartCompanyPrice");

const seeAllBtn = document.getElementById("seeAll");

const stockInfol = document.getElementById("fav_h_l");
const StockNameInfo = document.getElementById("DetailedCompName");
const CompanyCurrentPriceInfo = document.getElementById(
  "DetailedCompCurrentPrice",
);
const CompTickerInfo = document.getElementById("DetailedCompTicker");
const changeInfo = document.getElementById("DetailedChange");
const MarketCapInfo = document.getElementById("DetailedMarketCap");
const IndustryInfo = document.getElementById("DetailedIndustry");
const CountryInfo = document.getElementById("DetailedCountry");
const TrendInfo = document.getElementById("DetailedTrend");
const RatioInfo = document.getElementById("DetailedRatio");

const stockMainTiles = document.querySelector(".stock_main_tiles");

let currentStock;
let currentStockTab = [];
let curremFavStockSymbolTab = [];
let currentFavStockTab = [];

const stockCache = {};
const apiKey = "ADD YOUR FINHUB KEY";

let CarouselInfo = [];
let StockData = [];

const top20GlobalByMarketCap = [
  "NVDA",
  "AAPL",
  "MSFT",
  "AMZN",
  "GOOGL",
  "META",
  "TSLA",
  "AVGO",
  "DUOL",
  "LLY",
  "WMT",
  "JPM",
  "V",
  "XOM",
  "ORCL",
  "UNH",
  "MA",
  "COST",
  "HD",
  "PG",
];

async function getStockInfo(symbol) {
  symbol = symbol.toUpperCase();

  if (stockCache[symbol]) {
    const cached = stockCache[symbol];

    const isAlreadyAdded = StockData.some((item) => item.ticker === symbol);
    if (!isAlreadyAdded) {
      CarouselInfo.push({
        price: cached.priceData.c,
        name: cached.profileData.name,
        ticker: cached.profileData.ticker,
        logo: cached.profileData.logo,
        change: cached.priceData.d,
      });

      StockData.push({
        price: cached.priceData.c,
        volume: cached.priceData.v,
        name: cached.profileData.name,
        country: cached.profileData.country,
        industry: cached.profileData.finnhubIndustry,
        ticker: cached.profileData.ticker,
        logo: cached.profileData.logo,
        change: cached.priceData.d,
        capitalizacion: cached.metricData.metric.marketCapitalization,
        sharesQutstanding: cached.metricData.metric.shareOutstanding,
        peRatio: cached.metricData.metric.peBasicExclExtraTTM,
        trend: cached.priceData.dp,
      });
    }
    return;
  }

  try {
    const PriceUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
    const CompanyProfileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;
    const metricUrl = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${apiKey}`;

    const [PriceRest, ComProfRest, MetricRest] = await Promise.all([
      fetch(PriceUrl),
      fetch(CompanyProfileUrl),
      fetch(metricUrl),
    ]);

    const PriceData = await PriceRest.json();
    const ComProfData = await ComProfRest.json();
    const MetricData = await MetricRest.json();

    stockCache[symbol] = {
      priceData: PriceData,
      profileData: ComProfData,
      metricData: MetricData,
    };

    CarouselInfo.push({
      price: PriceData.c,
      name: ComProfData.name,
      ticker: ComProfData.ticker,
      logo: ComProfData.logo,
      change: PriceData.d,
    });

    StockData.push({
      price: PriceData.c,
      volume: PriceData.v,
      name: ComProfData.name,
      country: ComProfData.country,
      industry: ComProfData.finnhubIndustry,
      ticker: ComProfData.ticker,
      logo: ComProfData.logo,
      change: PriceData.d,
      capitalizacion: MetricData.metric.marketCapitalization,
      sharesQutstanding: MetricData.metric.shareOutstanding,
      peRatio: MetricData.metric.peBasicExclExtraTTM,
      trend: PriceData.dp,
    });
  } catch (error) {
    console.error(`Błąd podczas pobierania danych dla ${symbol}:`, error);
  }
}

async function fetchMultipleStockData(tickers) {
  CarouselInfo = [];
  StockData = [];

  const promises = tickers.map((ticker) => getStockInfo(ticker));
  await Promise.all(promises);
}

async function renderCarousel() {
  CarouselMain.forEach((carouselTile) => {
    carouselTile.innerHTML = "";
  });

  CarouselInfo.forEach((info) => {
    CarouselMain.forEach((carouselTile) => {
      carouselTile.innerHTML += `
                <div class="carousel">
                    <div class="carousel__left">
                        <div class="logo">
                            <img src="${info.logo}" alt="logo ${info.ticker}" width="35" height="35">
                        </div>
                        <p style="font-weight: 600;">${info.ticker}</p>
                    </div>
                    <div class="carousel__right">
                        <p style="margin-right: 7px;">${Number(info.price).toFixed(2)}</p>
                        <p class="growInfo ${info.change > 0 ? "up" : "down"}" style="color: ${info.change > 0 ? "green" : "red"}">${Number(info.change).toFixed(2)}%</p>
                    </div>
                </div>    
            `;
    });
  });
}

async function generateHomePageTiles() {
  let search_valuable = document.querySelector(".search_valuable");
  search_valuable.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    const data = StockData[i];
    if (data) {
      search_valuable.innerHTML += `
                <div class="valuable" id="${data.ticker}">
                    <div class="top">
                        <div class="compName">
                            <div class="logo">
                                <img src="${data.logo}"/>
                            </div>
                            <p class="imp_bol">${data.ticker}</p>
                        </div>
                        <span class="growInfo ${data.change > 0 ? "up" : "down"}">${Number(data.change).toFixed(2)}%</span>
                    </div>
                    <div class="botom">
                        <p>$${Number(data.price).toFixed(2)}</p>
                    </div>
                </div>
            `;
    }
  }
}

async function randomStockInfoDisplay() {
  let leftFavourtieMain = document.querySelector(".left_favourtie_main");
  leftFavourtieMain.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    const data = StockData[i];
    if (data) {
      leftFavourtieMain.innerHTML += `
                <div class="valuable" id="${data.ticker}">
                    <div class="top">
                        <div class="compName">
                            <div class="logo">
                                <img src="${data.logo}" alt="" class="">
                            </div>
                            <p class="imp_bol">${data.ticker}</p>
                        </div>
                        <span class="growInfo ${data.change > 0 ? "up" : "down"}">${Number(data.change).toFixed(2)}%</span>
                    </div>
                    <div class="botom"> 
                        <p>$${Number(data.price).toFixed(2)}</p>
                    </div>
                </div>
            `;
    }
  }
}

async function generateTiles() {
  await fetchMultipleStockData(top20GlobalByMarketCap);

  await renderCarousel();
  await generateHomePageTiles();
  await randomStockInfoDisplay();

  loadUserData();

  canClick();
}

generateTiles();

function canClick() {
  document.querySelectorAll(".valuable").forEach((tile) => {
    tile.addEventListener("click", (e) => {
      homePage.style.display = "none";
      stockInfoDisplay.style.display = "block";
      loading.classList.add("active");
      document.querySelectorAll(".icons i").forEach((x) => {
        if (x.textContent == 0) {
          x.classList.remove("active");
        } else if (x.textContent == 1) {
          x.classList.add("active");
        }
      });
      currentStock = e.currentTarget.id;
      insertData(e.currentTarget.id);
    });
  });
}

async function insertData(symbol) {
  document.querySelector(".ContainerRight header").classList.add("on");
  document.getElementById("home").classList.remove("active");
  document.getElementById("stoc").classList.add("active");

  document.getElementById("home").style.fontWeight = "400";
  document.getElementById("stoc").style.fontWeight = "bold";
  document.getElementById("home").style.cursor = "pointer";

  StockData = [];
  await getStockInfo(symbol);

  if (!StockData[0]) return;
  const data = StockData[0];

  companyInfoLeft.innerHTML = `<img src=${data.logo}>`;
  companyInfoChart.innerHTML = `<img src=${data.logo}>`;
  CompanyNameLeft.textContent = data.name;
  PriceLeft.textContent = "$" + Number(data.price).toFixed(0);

  chartCompanyName.textContent = data.name;
  chartCompanyTicker.textContent = data.ticker;
  chartCompanyPrice.textContent = `$${data.price || 0}`;

  infoDetailsHeadCompanyName.textContent = data.name;
  infoDetailsHeadCompanyTicker.textContent = data.ticker;
  companyDes.textContent = data.industry;
  stockInfol.textContent = data.name;
  StockNameInfo.textContent = data.name;
  CompanyCurrentPriceInfo.textContent = `$${data.price || 0}`;
  CompTickerInfo.textContent = data.ticker;
  changeInfo.textContent = `${data.change || 0}%`;
  MarketCapInfo.textContent = `$${data.capitalizacion}`;
  IndustryInfo.textContent = data.industry;
  CountryInfo.textContent = data.country;
  TrendInfo.textContent = `${(Number(data.trend) * 100).toFixed(2)}%`;
  RatioInfo.textContent = Number(data.peRatio).toFixed(1);

  loading.classList.remove("active");

  currentStockTab = [
    {
      logo: data.logo,
      name: data.name,
      price: data.price,
      change: data.change,
      ticker: data.ticker,
    },
  ];

  currentFavStockTab = [
    {
      logo: data.logo,
      ticker: data.ticker,
      change: data.change,
      price: data.price,
      name: data.name,
    },
  ];

  // Aktualizacja wykresu
  updateChart("6m");
}

document.querySelector("#mh").addEventListener("mouseenter", () => {
  console.log("najechano");
  document
    .querySelectorAll(".carousel")
    .forEach((c) => c.classList.add("paused"));
});

document.querySelector("#mh").addEventListener("mouseleave", () => {
  document
    .querySelectorAll(".carousel")
    .forEach((c) => c.classList.remove("paused"));
  console.log("zjechano");
});

searchInput.addEventListener("keypress", (e) => {
  StockData = [];
  if (e.key == "Enter") {
    loading.classList.add("active");
    stockInfoDisplay.style.display = "block";
    homePage.style.display = "none";
    insertData(searchInput.value.toUpperCase());
    currentStock = searchInput.value.toUpperCase();
    searchInput.value = "";
  }
});

home.addEventListener("click", () => {
  homePage.style.display = "block";
  stockInfoDisplay.style.display = "none";
  document.querySelector(".ContainerRight header").classList.remove("on");
  document.getElementById("home").style.fontWeight = "bold";
  document.getElementById("stoc").style.fontWeight = "400";
  document.getElementById("home").style.cursor = "auto";
});

chartBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("button.active").classList.remove("active");
    btn.classList.add("active");
    updateChart(btn.dataset.range);
  });
});

const exitBtn = document.getElementById("exit");
const confirBtn = document.getElementById("confir");
const StockUserInput = document.getElementById("StockUserInput");
const userPortfolioMain = document.querySelector(".user_portfolio_main");
const userCholding = document.getElementById("userHoldings");
const userTotalChange = document.getElementById("userTotalChange");

let userCholdingCahs = 0;
let userCholdingChange = 0;

function savePortfolioToLocal() {
  const portfolioItems = [];
}

let userPortfolioData = [];

buyBtn.addEventListener("click", () => {
  addStockToPortfolio.classList.add("active");
});

exitBtn.addEventListener("click", () => {
  addStockToPortfolio.classList.remove("active");
});

let firts = 0;

confirBtn.addEventListener("click", () => {
  if (firts == 0) {
    document.getElementById("portfoliDefault").style.display = "none";
    firts = 1;
  }
  if (StockUserInput.value != "") {
    const amount = Number(StockUserInput.value);
    const stock = currentStockTab[0];
    const newItem = {
      ticker: stock.ticker || currentStock,
      logo: stock.logo,
      name: stock.name,
      amount: amount,
      price: Number(stock.price),
      change: Number(stock.change),
    };

    userPortfolioData.push(newItem);

    localStorage.setItem("userPortfolio", JSON.stringify(userPortfolioData));

    renderPortfolioItem(newItem);
    userStockInfoUpdate();

    addStockToPortfolio.classList.remove("active");
    StockUserInput.value = "";
  }
});

function renderPortfolioItem(item) {
  userPortfolioMain.innerHTML += `
        <div class="portfolio_tile" data-ticker="${item.ticker}" data-amount="${item.amount}">
            <div class="left">
            <div id="exitFav">X</div>
            <div class="left_comp"> 
            <div class="logo"><img src="${item.logo}"/></div>
                <p>${item.name}</p>
                </div>
            </div>
            <div class="center">
                <p>${(item.price * item.amount).toFixed(2)}</p>
            </div>
            <div class="right">
                <p style="color:${item.change < 0 ? "red" : "green"}">${item.change}%</p>
            </div>
        </div>
    `;
}

function userStockInfoUpdate() {
  userCholdingCahs = 0;
  userCholdingChange = 0;

  userPortfolioData.forEach((item) => {
    userCholdingCahs += item.price * item.amount;
    userCholdingChange += item.change;
  });

  userCholding.textContent = `$${userCholdingCahs.toFixed(2)}`;
  userTotalChange.textContent = `${userCholdingChange.toFixed(2)}%`;
  userTotalChange.style.color = userCholdingChange < 0 ? "red" : "green";
}

userPortfolioMain.addEventListener("click", (e) => {
  const xBtn = e.target.closest("#exitFav");
  if (!xBtn) return;

  const tile = xBtn.closest(".portfolio_tile");
  const ticker = tile.dataset.ticker;
  const amount = parseFloat(tile.dataset.amount);

  const index = userPortfolioData.findIndex(
    (item) => item.ticker == ticker && item.amount == amount,
  );
  if (index > -1) {
    userPortfolioData.splice(index, 1);
    localStorage.setItem("userPortfolio", JSON.stringify(userPortfolioData));
  }

  tile.style.transition = "all 0.3s ease";
  tile.style.opacity = "0";
  tile.style.transform = "translateX(-50px)";

  setTimeout(() => {
    tile.style.display = "none";
    tile.remove();
  }, 350);

  userStockInfoUpdate();

  if (userPortfolioData.length === 0) {
    document.getElementById("portfoliDefault").style.display = "flex";
    firts = 0;
  }
});

const addtoFavouriteBtn = document.getElementById("buy");
const mainFavorite = document.querySelector(".main_fav_main");
let aaa = 0;

addToFavoriteBtn.addEventListener("click", () => {
  const currentTicker = currentFavStockTab[0].ticker;

  if (curremFavStockSymbolTab.includes(currentTicker)) {
    alert("You have already added this action to your favorites");
  } else {
    curremFavStockSymbolTab.push(currentTicker);

    const favItem = currentFavStockTab[0];

    let savedFavs = JSON.parse(localStorage.getItem("userFavorites")) || [];
    savedFavs.push(favItem);
    localStorage.setItem("userFavorites", JSON.stringify(savedFavs));
    localStorage.setItem(
      "userFavoritesSymbols",
      JSON.stringify(curremFavStockSymbolTab),
    );

    if (aaa == 0) {
      document.querySelector(".main_fav_main p").style.display = "none";
      aaa = 1;
    }

    displayFavStock(favItem);
    document.querySelector(".favDec").classList.add("active");

    setTimeout(() => {
      document.querySelector(".favDec").classList.remove("active");
    }, 600);
  }
});

function displayFavStock(item) {
  const data = item || currentFavStockTab[0];

  mainFavorite.innerHTML += `
        <div class="valuable" id="${data.ticker}">
            <div class="top">
            <div id="exitLFav">X</div>
            <div class="compName">
                <div class="logo">
                    <img src="${data.logo}" alt="" class="">
                </div>
                <p class="imp_bol">${data.ticker}</p>
            </div>
            <span class="growInfo ${data.change > 0 ? "up" : "down"}">${Number(data.change).toFixed(2)}%</span>
            </div>
            <div class="botom"> 
                <p>$${data.price}</p>
            </div>
        </div>
    `;
}

mainFavorite.addEventListener("click", (e) => {
  const xBtn = e.target.closest("#exitLFav");
  if (!xBtn) return;

  const tile = xBtn.closest(".valuable");
  const tickerToRemove = tile.id;

  curremFavStockSymbolTab = curremFavStockSymbolTab.filter(
    (t) => t !== tickerToRemove,
  );

  let savedFavs = JSON.parse(localStorage.getItem("userFavorites")) || [];
  savedFavs = savedFavs.filter((item) => item.ticker !== tickerToRemove);

  localStorage.setItem("userFavorites", JSON.stringify(savedFavs));
  localStorage.setItem(
    "userFavoritesSymbols",
    JSON.stringify(curremFavStockSymbolTab),
  );

  tile.style.transition = "all 0.3s ease";
  tile.style.opacity = "0";
  tile.style.transform = "translateX(-50px)";

  setTimeout(() => {
    tile.style.display = "none";
    tile.remove();
  }, 400);

  if (savedFavs.length === 0) {
    document.querySelector(".main_fav_main p").style.display = "block";
    aaa = 0;
  }
});

function loadUserData() {
  const savedPortfolio = JSON.parse(localStorage.getItem("userPortfolio"));
  if (savedPortfolio && savedPortfolio.length > 0) {
    userPortfolioData = savedPortfolio;
    document.getElementById("portfoliDefault").style.display = "none";
    firts = 1;

    userPortfolioData.forEach((item) => {
      renderPortfolioItem(item);
    });
    userStockInfoUpdate();
  }

  const savedFavs = JSON.parse(localStorage.getItem("userFavorites"));
  const savedFavsSymbols = JSON.parse(
    localStorage.getItem("userFavoritesSymbols"),
  );

  if (savedFavs && savedFavs.length > 0) {
    curremFavStockSymbolTab = savedFavsSymbols || [];
    document.querySelector(".main_fav_main p").style.display = "none";
    aaa = 1;

    savedFavs.forEach((item) => {
      displayFavStock(item);
    });
  }
}

// ================= WYKRES =================

let ctx = document.getElementById("stockChart").getContext("2d");
let chart = null;

function initChart() {
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          borderColor: "#22c55e",
          backgroundColor: "rgba(34, 197, 94, 0.12)",
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0.1,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } },
    },
  });
}

async function getCandles(symbol = "AAPL", range = "6m") {
  symbol = symbol.trim().toUpperCase();
  if (symbol === "APPL") symbol = "AAPL";

  const rangeMap = {
    "1d": "1d",
    "7d": "5d",
    "1m": "1mo",
    "6m": "6mo",
    "1y": "1y",
    "5y": "5y",
    all: "max",
  };
  const intervalMap = {
    "1d": "1m",
    "7d": "5m",
    "1m": "1d",
    "6m": "1d",
    "1y": "1wk",
    "5y": "1mo",
    all: "3mo",
  };

  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${rangeMap[range]}&interval=${intervalMap[range]}`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(yahooUrl)}`;

  try {
    const res = await fetch(proxyUrl);
    const data = await res.json();
    const json = JSON.parse(data.contents);

    const result = json.chart?.result?.[0];
    if (!result?.timestamp) throw new Error("Brak danych");

    const prices = result.indicators.quote[0].close
      .map((p) => (p === null ? null : Number(p.toFixed(2))))
      .filter((p) => p !== null);

    const isUp = prices[prices.length - 1] >= prices[0];
    return { prices, isUp };
  } catch (e) {
    const mockData = {
      "1d": [218, 219, 221, 223, 222, 225, 227, 230],
      "7d": Array(30)
        .fill()
        .map((_, i) => 220 + Math.sin(i / 3) * 5 + i * 0.2),
      "1m": Array(22)
        .fill()
        .map((_, i) => 210 + i * 1.5),
      "6m": Array(130)
        .fill()
        .map((_, i) => 180 + i * 0.45),
      "1y": Array(52)
        .fill()
        .map((_, i) => 150 + i * 1.8),
      "5y": Array(60)
        .fill()
        .map((_, i) => 100 + i * 2.2),
      all: Array(120)
        .fill()
        .map((_, i) => 50 + i * 2.5),
    };
    const prices = mockData[range] || mockData["6m"];
    return { prices, isUp: true };
  }
}

async function updateChart(range) {
  const symbol =
    document.getElementById("chartCompanyTicker")?.textContent?.trim() ||
    document.getElementById("DetailedCompTicker")?.textContent?.trim() ||
    "AAPL";

  const data = await getCandles(symbol, range);

  if (!chart) initChart();

  chart.data.labels = Array(data.prices.length).fill("");
  chart.data.datasets[0].data = data.prices;
  chart.data.datasets[0].borderColor = data.isUp ? "#22c55e" : "#ef4444";
  chart.data.datasets[0].backgroundColor = data.isUp
    ? "rgba(34, 197, 94, 0.12)"
    : "rgba(239, 68, 68, 0.12)";
  chart.update();
}

initChart();

updateChart("6m");

setTimeout(() => {
  StartPageLoading.style.display = "none";
}, 3000);
