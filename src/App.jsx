import { Outlet } from "react-router-dom";
import { LanguageSelector } from "./shared/components/LanguageSelector";
import { NavBar } from "./shared/components/NavBar";
import { AuthenticationContext } from "./shared/state/context";
import { ToastProvider } from "./shared/components/Toast";

function App() {

  return (
    <AuthenticationContext>
      <ToastProvider>
        <NavBar/>
        <div className="container mt-3">
          <Outlet />
          <LanguageSelector />
        </div>
      </ToastProvider>
    </AuthenticationContext>
  );
}

export default App;