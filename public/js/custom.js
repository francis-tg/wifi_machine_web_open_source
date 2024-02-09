const date = new Date();
const today = `${String(date.getUTCFullYear()).padStart(2, "0")}-${String(
  date.getUTCMonth() + 1
).padStart(2, 0)}-${String(date.getDate()).padStart(2, "0")}`;

$(document).ready(function () {
  $("#devicetable").DataTable({
    ordering: true,
    padding: true,
    select: true
  });
});

/* Tickets tables */
$(document).ready(function () {
  $("#ticketsTable").DataTable({
    paging: true,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: false,
    responsive: true
  });
});

/* 
Custommize path
*/
const path = window.location.pathname;
if (path == "/statistics/" || path == "/statistics") {
  const statistic = document.getElementById("statistic");
  statistic.classList.toggle("active");
}
if (path == "/devices/" || path == "/devices") {
  const statistic = document.getElementById("devices");
  statistic.classList.toggle("active");
}
if (path == "/tickets/" || path == "/tickets") {
  const statistic = document.getElementById("tickets");
  statistic.classList.toggle("active");
}
if (path == "/settings/" || path == "/settings") {
  const statistic = document.getElementById("settings");
  statistic.classList.toggle("active");
}
if (path == "/") {
  const statistic = document.getElementById("home");
  statistic.classList.toggle("active");
}
/* 
Tickets Unavailable
*/
const ExpireTicket = document.getElementById("getExpiredTicket")
  ? document.getElementById("getExpiredTicket").innerText
  : "";
const expirebtn = document.getElementById("clean");

expirebtn ? (expirebtn.style.display = "none") : "";
expirebtn
  ? setTimeout(() => {
      const element = document.getElementById("expirebtn");
      if (ExpireTicket >= 200) {
        expirebtn.style.display = "block";
        expirebtn.classList.toggle("btn-danger");
        element.classList.add("shake");
        element.classList.toggle("bg-danger");
        element.style.cursor = "pointer";
        element.style.borderRadius = "10px";
        expirebtn.addEventListener("click", () => {
          const Url = expirebtn.dataset.redirecturl;
          location.href = Url;
        });
      }
    }, 3000)
  : null;

const reqBtns = document.querySelectorAll("button");
for (let rq = 0; rq < reqBtns.length; rq++) {
  const ReqBtn = reqBtns[rq];
  ReqBtn.addEventListener(
    "click",
    () => {
      if (ReqBtn.dataset.btn === "request") {
        const method = ReqBtn.dataset.method;
        const url = ReqBtn.dataset.url;
        const data = ReqBtn.dataset.data;
        const confirme = ReqBtn.dataset.confirm;
        if (method && url) {
          if (confirme === "true") {
            const getPerm = confirm(ReqBtn.dataset.msg);
            if (getPerm === true) {
              $.ajax({
                type: method,
                url: url,
                data: data ? data : null,
                dataType: "json",
                success: function (response) {
                  console.log(response);
                }
              });
            }
          } else {
            $.ajax({
              type: method,
              url: url,
              data: data ? data : null,
              dataType: "json",
              success: function (response) {
                console.log(response);
              }
            });
          }
        }
      }
    },
    false
  );
}

const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

console.log(today);
if (startDate) {
  startDate.setAttribute("min", today);
  startDate.setAttribute("value", today);
  startDate.value === ""
    ? endDate.setAttribute("disabled", true)
    : endDate.removeAttribute("disabled");
  endDate.setAttribute("min", startDate.value);
  endDate.setAttribute("value", startDate.value);
  startDate.onchange = () => {
    startDate.value === ""
      ? endDate.setAttribute("disabled", true)
      : endDate.removeAttribute("disabled");
    endDate.setAttribute("min", startDate.value);
    endDate.setAttribute("value", startDate.value);
  };
}
const ciscoBtns = document.querySelectorAll(".cisco-btn");
const CiscoLabels = document.querySelectorAll("#cisco-format-label");
const CiscoValidity = document.querySelectorAll("#ciscoValidity");
const CiscoFormats = document.querySelectorAll("#cisco-format");
for (let cb = 0; cb < ciscoBtns.length; cb++) {
  const ciscoBtn = ciscoBtns[cb];
  ciscoBtn.addEventListener(
    "click",
    () => {
      window.location.href = ciscoBtn.dataset.url;
    },
    false
  );
}

function addIntPlural(item, val) {
  if (parseInt(item) > 1) {
    return item + " " + val + "s";
  } else return item + " " + val;
}

for (let l = 0; l < CiscoLabels.length; l++) {
  const CiscoGetLabel = CiscoLabels[l];
  const CiscoLabel = CiscoGetLabel.innerHTML;
  if (CiscoLabel.slice(1) === "h") {
    CiscoGetLabel.innerHTML = addIntPlural(CiscoLabel.slice(0, 1), "heure");
    // console.log(label)
  } else if (CiscoLabel.slice(1) === "w") {
    CiscoGetLabel.innerHTML = addIntPlural(CiscoLabel.slice(0, 1), "semaine");
  } else if (CiscoLabel.slice(1) === "d") {
    CiscoGetLabel.innerHTML = addIntPlural(CiscoLabel.slice(0, 1), "jour");
  }
}

const AllMaskIp = document.querySelectorAll(".mask-ip");

for (let m = 0; m < AllMaskIp.length; m++) {
  const maskIP = AllMaskIp[m];
  maskIP.setAttribute("pattern", "/(d{2-3})(d{1-3})(d{1-3})(d{1-3})/");
  maskIP.addEventListener(
    "focusout",
    () => {
      const number = AllMaskIp[m].value.replace(
        /(\d{2,3})(\d{1,3})(\d{1,3})(\d{1,3})/,
        "$1.$2.$3.$4"
      );
      console.log(number);
      AllMaskIp[m].value = number;
    },
    false
  );
}

for (const key in CiscoValidity) {
  if (Object.hasOwnProperty.call(CiscoValidity, key)) {
    const validity = CiscoValidity[key];
    let result;
    const content = validity.innerText;
    const hour = /[0-9]{1,5}h/;
    const min = /[0-9]{1,2}m/;
    const day = /[0-9]{1,2}d/;
    const week = /[0-9]{1,5}w/;
    const digit = /[0-9]+/;

    if (hour.test(content)) {
      validity.innerHTML =
        "validité: " + addIntPlural(digit.exec(content)[0], "heure");
    } else if (min.test(content)) {
      validity.innerHTML =
        "validité: " + addIntPlural(digit.exec(content)[0], "minute");
    } else if (day.test(content)) {
      validity.innerHTML =
        "validité: " + addIntPlural(digit.exec(content)[0], "jour");
    } else if (week.test(content)) {
      validity.innerHTML =
        "validité: " + addIntPlural(digit.exec(content)[0], "semaine");
    }

    console.log("format");
  }
}

for (const key in CiscoFormats) {
  if (Object.hasOwnProperty.call(CiscoFormats, key)) {
    const format = CiscoFormats[key];
    let result;
    const content = format.innerText;
    const hour = /[0-9]{1,5}h/;
    const min = /[0-9]{1,2}m/;
    const day = /[0-9]{1,2}d/;
    const week = /[0-9]{1,5}w/;
    const digit = /[0-9]+/;

    if (hour.test(content)) {
      format.innerHTML = addIntPlural(digit.exec(content)[0], "heure");
    } else if (min.test(content)) {
      format.innerHTML = addIntPlural(digit.exec(content)[0], "minute");
    } else if (day.test(content)) {
      format.innerHTML = addIntPlural(digit.exec(content)[0], "jour");
    } else if (week.test(content)) {
      format.innerHTML = addIntPlural(digit.exec(content)[0], "semaine");
    }
  }
}
const getBuyForm = document.getElementById("buyTicket");

getBuyForm &&
  getBuyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const uptime = event.target[0].value;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("price", uptime);
    await fetch(`${location.origin}/api/tickets/buy`, {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    }).then(async (response) => {
      if (response.status === 200) {
        const noty = new Noty({
          theme: "sunset",
          text: "Ticket créé avec success...",
          type: "success"
        });
        noty.show();
        noty.setTimeout(3500);
        setTimeout(() => {
          location.reload();
        }, 4000);
      } else {
        const noty = new Noty({
          theme: "sunset",
          text: "Une erreur est survenu...",
          type: "error"
        });
        noty.show();
        noty.setTimeout(3500);
        setTimeout(() => {
          location.reload();
        }, 4000);
      }
    });
  });
