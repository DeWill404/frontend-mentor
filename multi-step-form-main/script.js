const TABS = {
  PERSONAL: { id: "personal-info", order: 0 },
  PLAN: { id: "plan", order: 1 },
  ADD_ONS: { id: "add-ons", order: 2 },
  SUMMARY: { id: "summary", order: 3 },
  THANK_YOU: { id: "thank-you", order: 4 },
};
const PERIOD = {
  YEARLY: { abbr: "yr", id: "yearly" },
  MONTHLY: { abbr: "mo", id: "monthly" },
};
const PLAN = {
  ARCADE: { id: "arcade", monthly_cost: 9, yearly_off_months: 2 },
  ADVANCED: { id: "advanced", monthly_cost: 12, yearly_off_months: 2 },
  PRO: { id: "pro", monthly_cost: 15, yearly_off_months: 2 },
};
const ADD_ONS = {
  ONLINE: {
    id: "online-service",
    monthly_cost: 1,
    yearly_off_months: 2,
    name: "Online Service",
  },
  STORAGE: {
    id: "larger-storage",
    monthly_cost: 2,
    yearly_off_months: 2,
    name: "Larger Storage",
  },
  CUSTOMIZATION: {
    id: "customizable-profile",
    monthly_cost: 2,
    yearly_off_months: 2,
    name: "Customizable Profile",
  },
};

let currentTab = TABS.PERSONAL;
let currentPeriod = PERIOD.MONTHLY;
let currentPlan = PLAN.ARCADE;
let selectedAddOns = [];

const containerElement = document.querySelector(".container");

const getTabId = (tabId) => "#" + tabId + "-tab";
const getPlanId = (planId) => "#plan-" + planId;
const getPeriodId = (periodId) => "#period-" + periodId;
const getAddOnsId = (addOnsId) => "#add-ons-" + addOnsId;

const updateAndGetCharge = (obj, elementClass) => {
  const chargeElement = document.querySelector(elementClass);

  let charge = obj.monthly_cost;
  if (currentPeriod == PERIOD.YEARLY) {
    charge = (12 - obj.yearly_off_months) * charge;
  }
  if (chargeElement) {
    chargeElement.innerText = `$${charge}/${currentPeriod.abbr}`;
  }
  return charge;
};

function triggerChangeEvent(ele) {
  var event = new Event("change");
  ele.dispatchEvent(event);
}

function validatePersonalTab() {
  const validateInput = (input, matcher, msg) => {
    const val = input.value;
    const errElement = input.previousElementSibling;
    if (val.match(matcher)) {
      errElement.classList.add("hidden");
      return true;
    }
    errElement.innerText = msg;
    errElement.classList.remove("hidden");
    return false;
  };

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const number = document.getElementById("number");

  let isNameValid = validateInput(name, /.+/, "This field is required.");

  let isEmailValid = validateInput(email, /.+/, "This field is required.");
  if (isEmailValid) {
    isEmailValid = validateInput(
      email,
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Invalid Email."
    );
  }

  let isNumberValid = validateInput(number, /.+/, "This field is required.");
  if (isNumberValid) {
    isNumberValid = validateInput(
      number,
      /^(\+[0-9]{1,3}[-. ])?[0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4}$/,
      "Invalid Phone Number."
    );
  }

  return isNameValid && isEmailValid && isNumberValid;
}

function setAddOnsTab() {
  Object.values(ADD_ONS).forEach((addOnsObj) => {
    updateAndGetCharge(addOnsObj, `${getAddOnsId(addOnsObj.id)} ~ .charge`);
  });
}

function setSummaryTab() {
  let tabName = currentPlan.id[0].toUpperCase() + currentPlan.id.substring(1);
  let perdiodName =
    currentPeriod.id[0].toUpperCase() + currentPeriod.id.substring(1);

  const tabNameClass = `${getTabId(TABS.SUMMARY.id)} .plan-name`;
  const tabNameElement = document.querySelector(tabNameClass);
  tabNameElement.innerText = `${tabName} (${perdiodName})`;

  let totalCharge = updateAndGetCharge(
    currentPlan,
    `${getTabId(TABS.SUMMARY.id)} .plan-details .charge`
  );

  const exsistingAddOns = document.querySelectorAll(
    `${getTabId(TABS.SUMMARY.id)} .charge-breakup .divider ~ .charge-details`
  );
  exsistingAddOns.forEach((ele) => ele.remove());

  const addOnContainer = document.querySelector(
    `${getTabId(TABS.SUMMARY.id)} .charge-breakup`
  );
  selectedAddOns.forEach((addOns) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("charge-details");
    const name = document.createElement("span");
    name.classList.add("detail");
    name.innerText = addOns.name;
    wrapper.appendChild(name);
    const cost = document.createElement("span");
    cost.classList.add("charge");
    let charge = updateAndGetCharge(addOns);
    cost.innerText = `+$${charge}/${currentPeriod.abbr}`;
    wrapper.appendChild(cost);
    addOnContainer.appendChild(wrapper);
    totalCharge += charge;
  });

  const totalDetailElement = document.querySelector(
    `${getTabId(TABS.SUMMARY.id)} .total-charge .detail`
  );
  totalDetailElement.innerText = `Total (per ${currentPeriod.id.substring(
    0,
    currentPeriod.id.length - 2
  )})`;

  const totalChargeElement = document.querySelector(
    `${getTabId(TABS.SUMMARY.id)} .total-charge .charge`
  );
  totalChargeElement.innerText = `${totalCharge}/${currentPeriod.abbr}`;
}

function validate(tabObj) {
  if (!tabObj) {
    return false;
  }

  if (currentTab == tabObj) {
    return false;
  }

  if (currentTab == TABS.PERSONAL) {
    return validatePersonalTab();
  }

  if (tabObj == TABS.ADD_ONS) {
    setAddOnsTab();
  } else if (tabObj == TABS.SUMMARY) {
    setSummaryTab();
  }
  return true;
}

function updateCurrentTab(tabObj) {
  if (validate(tabObj)) {
    currentTab = tabObj;
    containerElement.setAttribute("current-tab", tabObj.id);
    const tabGroup = document.querySelector(".steps-group");
    const tabElement = document.querySelector(getTabId(tabObj.id));
    tabGroup.scrollTo(tabElement.offsetLeft, 0);
  }
}

function nextTab() {
  const nextTabObj = Object.values(TABS).find(
    (tabObj) => tabObj.order == currentTab.order + 1
  );
  updateCurrentTab(nextTabObj);
}

function prevTab() {
  const prevTabObj = Object.values(TABS).find(
    (tabObj) => tabObj.order == currentTab.order - 1
  );
  updateCurrentTab(prevTabObj);
}

window.onload = () => {
  Object.values(TABS).forEach((tabObj) => {
    if (tabObj != TABS.THANK_YOU) {
      const btnId = tabObj.id + "-indicator";
      document.getElementById(btnId).onclick = () => {
        updateCurrentTab(tabObj);
      };
    }
  });

  Object.values(PLAN).forEach((planObj) => {
    const planInput = document.querySelector(getPlanId(planObj.id));
    planInput.onchange = () => (currentPlan = planObj);
  });

  Object.values(PERIOD).forEach((periodObj) => {
    const periodInput = document.querySelector(getPeriodId(periodObj.id));
    periodInput.onchange = () => {
      currentPeriod = periodObj;

      Object.values(PLAN).forEach((planObj) => {
        updateAndGetCharge(planObj, `${getPlanId(planObj.id)} + label .charge`);

        const offerElement = document.querySelector(
          `${getPlanId(planObj.id)} + label .offer`
        );
        offerElement.classList.toggle("hidden-dn");
      });

      const switchBtnClass = `${getTabId(TABS.PLAN.id)} .switch`;
      const switchBtn = document.querySelector(switchBtnClass);
      switchBtn.classList.toggle("yearly");
    };
  });

  const switchBtnClass = `${getTabId(TABS.PLAN.id)} .switch`;
  const switchBtn = document.querySelector(switchBtnClass);
  switchBtn.onclick = (e) => {
    const monthlyInput = document.querySelector(getPeriodId(PERIOD.MONTHLY.id));
    const yearlyInput = document.querySelector(getPeriodId(PERIOD.YEARLY.id));
    if (monthlyInput.checked) {
      yearlyInput.checked = true;
      triggerChangeEvent(yearlyInput);
    } else {
      monthlyInput.checked = true;
      triggerChangeEvent(monthlyInput);
    }
  };

  Object.values(ADD_ONS).forEach((addOnsObj) => {
    const addOnElement = document.querySelector(getAddOnsId(addOnsObj.id));
    addOnElement.onchange = (e) => {
      if (e.target.checked) {
        selectedAddOns.push(addOnsObj);
      } else {
        selectedAddOns = selectedAddOns.filter((obj) => obj != addOnsObj);
      }
    };
  });

  const planChangeBtnClass = `${getTabId(TABS.SUMMARY.id)} .plan-changer`;
  const planChangeBtn = document.querySelector(planChangeBtnClass);
  planChangeBtn.onclick = () => updateCurrentTab(TABS.PLAN);

  document.getElementById("nav-next-btn").onclick = nextTab;
  document.getElementById("nav-back-btn").onclick = prevTab;
};
