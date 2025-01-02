const BASE_URL =
  "https://api.currencyapi.com/v3/latest?apikey=cur_live_9u05Qf4QfBYERW5B9akqClXKWD4p9qsEFxDuHp0H";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


// Populate dropdowns with available currencies
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Construct the API URL
  const URL = `${BASE_URL}&base_currency=${fromCurr.value}&currencies=${toCurr.value}`;
  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error("Failed to fetch exchange rate.");

    let data = await response.json();

    // Extract the exchange rate
    let rate = data.data[toCurr.value].value;

    // Calculated the converted amount
    const convertedAmount = (amtVal * rate).toFixed(2);

    // Display the result
    msg.innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Failed to fetch exchange rate. Try again later.";
  }
};

// Update the flag based on the selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Handle the convert button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});
