import React from "react";
import { Block } from "./block";
import "./index.scss";

function App() {
  const [fromCurrency, setFromCurrency] = React.useState("UAH");
  const [toCurrency, setToCurrency] = React.useState("USD");
  const [fromPrice, setFromPrice] = React.useState(0);
  const [toPrice, setToPrice] = React.useState(1);
  //! const [rates, setRates] = React.useState({});
  const ratesRef = React.useRef({});

  React.useEffect(() => {
    fetch(
      "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=20221129&json"
    )
      .then((res) => res.json())
      .then((json) => {
        //setRates(Object.fromEntries(json.map((n) => [n.cc, n.rate])));
        ratesRef.current = Object.fromEntries(json.map((n) => [n.cc, n.rate]));
        onChangeToPrice(1);
      })
      .catch((err) => {
        console.warn(err);
        alert("Error fetch");
      });
  }, []);

  const onChangeFromPrice = (value) => {
    const price =
      fromCurrency === "UAH"
        ? 1
        : ratesRef.current[fromCurrency] / ratesRef.current[toCurrency];
    const result =
      toCurrency !== "UAH"
        ? value *
          (fromCurrency === "UAH"
            ? price / ratesRef.current[toCurrency]
            : price)
        : value * ratesRef.current[fromCurrency];

    setFromPrice(value);
    setToPrice(result.toFixed(3));
  };

  const onChangeToPrice = (value) => {
    const price =
      toCurrency === "UAH"
        ? 1
        : ratesRef.current[toCurrency] / ratesRef.current[fromCurrency];
    const result =
      fromCurrency !== "UAH"
        ? value *
          (toCurrency === "UAH"
            ? price / ratesRef.current[fromCurrency]
            : price)
        : value * ratesRef.current[toCurrency];
    setToPrice(value);
    setFromPrice(result.toFixed(3));
  };

  React.useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency]);

  React.useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency]);

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={setFromCurrency}
        onChangeValue={onChangeFromPrice}
      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={setToCurrency}
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
