import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { Provider } from "react-redux";
import { store } from "./store";
import { I18nextProvider } from "react-i18next";
import i18n from "./config/i18n";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <AppRoutes />
        </I18nextProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
