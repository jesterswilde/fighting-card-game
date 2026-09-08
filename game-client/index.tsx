import { h, Component, render } from "preact";
import { Provider } from "preact-redux";
import { store, StoreState } from "./src/state/store";
import App from "./src/components/app";
import { Store } from "redux";

let Prov = Provider as unknown as (store: any) => JSX.Element;

const renderApp = () => {
  const rootNode = document.getElementById("root");

  render(
    <Prov store={store}>
      <App />
    </Prov>,
    rootNode,
    rootNode.lastChild as Element,
  );
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderApp);
} else {
  renderApp();
}
