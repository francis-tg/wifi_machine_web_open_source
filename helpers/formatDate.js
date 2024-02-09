const today = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  return dd + "/" + mm + "/" + yyyy;
};

const SpliteDate = (date) => {
  if (date != null) {
    const data = new Date(date.toString());
    const getFulldate =
      String(data.getDate()).padStart(2, "0") +
      "/" +
      String(data.getMonth() + 1).padStart(2, "0") +
      "/" +
      data.getFullYear();
    return getFulldate;
  }
};
const FormatToInputDate = (date) => {
  const data = new Date(date.toString());
  const getFulldate =
    data.getFullYear() +
    "-" +
    String(data.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(data.getDate()).padStart(2, "0");
  console.log(getFulldate);
  return getFulldate;
};

const CalcDate = (date, addday = 0, addMonth = 0, addYear = 0) => {
  if (date != null) {
    const data = new Date(date.toString());
    const getFulldate =
      String(data.getDate() + parseInt(addday)).padStart(2, "0") +
      "/" +
      String(data.getMonth() + 1 + parseInt(addMonth)).padStart(2, "0") +
      "/" +
      (data.getFullYear() + parseInt(addYear));
    return getFulldate;
  }
};
/**
 *
 * @param {string} date
 * @returns {object} result
 */
const FormatDate = (date) => {
  const months = [
    "Janvier",
    "Fevrier",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Setpembre",
    "Octobre",
    "Novembre",
    "Décembre"
  ];
  const result = {
    month: "",
    day: "",
    years: 0
  };
  if (date !== null) {
    const dDate = new Date(String(date).toString());
    result.day = String(dDate.getUTCDate()).padStart(2, "0");
    result.years = dDate.getUTCFullYear();
    result.month = months[dDate.getUTCMonth()];
  }
  const dDate = new Date();
  result.day = String(dDate.getUTCDate()).padStart(2, "0");
  result.years = dDate.getUTCFullYear();
  result.month = months[dDate.getUTCMonth()];
  return result;
};

// console.log(FormatDate())

module.exports = {today, SpliteDate, FormatToInputDate, CalcDate, FormatDate};
